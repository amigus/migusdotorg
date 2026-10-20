+++
date = 2026-10-19
draft = false
keywords = ["ai", "agent", "harness", "lisa", "llm"]
tags = ["ai", "agents", "open-source"]
summary = "An introduction to Lisa, the open-source AI agent harness: enforceable limits, receipt-based verification, and lossless context."
title = 'Introducing Lisa'
+++

Lisa is an open-source AI agent harness and runtime.
Agent frameworks make models capable of action,
but most don't do much to make them account for it.
I built Lisa to close that gap,
with two overarching principles top of mind:
reliability and safety.
Both trace back to the same conclusion:
Copilot, Claude et al. trust the model instead of constraining it.
Designing around those principles led to Lisa's defining features:

- **Budgets and limits**: the model operates within a budget;
  if it overruns the budget, then it becomes an enforced limit.
- **Dynamic model use**: the model is chosen at runtime;
  and it can change during execution based on state.
- **Lossless context**: there is no compaction;
  instead it actively manages context to keep it within the model's limit.
- **Verifiable actions**: intention drives action, and action has an effect;
  and it uses that relationship to drive receipt-based verification.

## Why

I've been writing software since the 1990s.
So when AI-assisted software engineering became a real thing in 2025,
I could see the potential immediately.
I knew that I could now build bigger,
more complex systems by myself,
than I ever could before.
And so,
that's what I did!
I started building a big thing with AI:
[CloudServers.app][cloudServersLink].

I used [Visual Studio Code][visualStudioCodeLink], which includes Copilot.
And as I got closer to launch in early 2026,
I created a Copilot agent named "Launch Scale Advisor,"
which I abbreviated as LSA,
to help me plan and execute the launch!
That led me to want LSA to help me with non-coding-related tasks.
The trouble was, I didn't trust Copilot to do non-coding things!

By the time I got to building the operational support capabilities,
I had become convinced of two things:

1. I want an AI-driven approach to operations and support,
   but not just technical, business and finance too.
2. Copilot/Claude agents and "skills" weren't enough.

### Model-action intermediation

The biggest problem to me was that the trust ran in the wrong direction,
and it showed in the implementation.
Yes, you could limit the tools that are available to the agent,
but the way it was implemented did not constitute a hard (enforceable) boundary.

Then there were "skills," the agent + prompt [+ tool] reuse pattern,
which to me,
was too ill-defined and unstructured.
For one thing,
I thought there needed to be a first-class definition of "tool."
I also wanted a way to create reusable instances of model-tool use.

## Why not an existing library?

LangChain and LangGraph are excellent at helping you build agents —
LangGraph in particular gives you durable,
stateful orchestration with checkpointing and human-approval gates.
CrewAI makes multi-agent collaboration accessible,
with role-based crews you can stand up quickly.
And Pi — Lisa's closest cousin — is a minimal,
extensible harness whose bet is the opposite of mine:
adapt the harness to your workflows,
rather than codify semantics into the harness itself.

All defensible designs effectively tackling their concerns,
but none of them were addressing mine.
I didn't need help building agents;
I needed the runtime to constrain the model inside the turn loop.
So the decision not to use them was pragmatic, not ideological.

The thing is,
I had major FOMO after seeing everything they were doing!
Those existing libraries had a lot of momentum and support,
and if they built something useful to me,
I wanted to be able to leverage it.
So if I was going to build something separately,
it would need to be extremely composable and modular.

## What is it

Fundamentally,
Lisa is about reliability and safety,
and while I didn't (and still don't) know what that will mean long term,
I knew it at least meant enforceable limits,
model constraints,
and model-tool intermediation.
Thus the goal became codifying that:
the intention → action → tool loop,
but without codifying particular intentions,
actions or tools.

To achieve that design, I went with a kernel,
runtime, and SDK architecture with loadable "packs."
That way I could codify the semantics in the kernel,
the patterns in the runtime,
the reusable components,
in the SDK,
and the modes,
operations, tools,
in packs.

### Budgets and limits

The turn loop supplies the kernel with a budget.
Lisa tells the model how many iterations it can run,
how many tool calls it can make,
and how many mode switches it can complete,
before the turn is complete.
The budget is a request the model can see and plan around.
If the model ignores the budget,
the harness steps in and enforces it as a hard limit —
the model is not in control.

![Terminal recording of Lisa enforcing a turn budget: the model hits a limit mid-turn and the harness cuts it off](/img/introducing-lisa/enforced-limit.gif)

### Dynamic model use

The harness discovers all available models and builds a manifest.
The manifest includes the list of models,
and metadata about each one.
It can then use that metadata (and running state) to drive selection,
which it does through a direct mode→model map or (optional) model router.

The model router evaluates [CEL][celDefinitionLink] expressions to select a model.

```yaml
mode_models:
  coding_execute: glm-5.3-flash:cloud
  coding_review: glm-5.3-flash:cloud
  default: glm-5.3:cloud
  shell: glm-5.3-flash:cloud
router:
  backend: lisa-router
  rules:
  - when: >-
      route.operation_id in [
        "markdown_forge_document",
        "mine_thread_segment",
        "synthesize_and_store_learning"
      ]
    use: deepseek-v4.1-pro:cloud
```

The router can reference values in `model.`, `route.`, and `turn.`.
See the router's [README.md][routerReadmeLink] for details.

### Lossless context

Lisa keeps all input and output in an append-only "thread log."
It then uses that thread log to give the model a point-in-time digest.
As the context grows,
Lisa swaps references for full details,
and gives the model a way to dereference them to get the full details on demand.
The digest updates each turn and always stays within the model's context window.
The result is an arbitrarily complex but consistently coherent conversation.
It also lets Lisa reproduce any past response verbatim.

### Verifiable actions

Lisa gets receipts!
When the turn input matches a mode's intent,
the harness switches modes.
The mode declares its effect —
*read*,
*write* (the default),
*execute*,
or *external_write*.
When the model takes the action,
it produces a receipt.
When the turn completes,
the harness collects every outstanding receipt.
So: intent → mode → effect → receipt → collection.
An outstanding is a broken promise —
the model intended an action and did not complete it.
Lisa knows that and tells you.

```yaml
routing_intent_tags: [code, write, implement]
satisfies_intents: [code, write, implement]
routing_intent_keywords:
  implement: [implement, refactor, patch]
  code: [write code, generate code, edit code]
```

Modes also declare which operations and tools the model can use:

```yaml
allowed_operation_ids:
  - delegate
  - fork
  - recall_memory
  - synthesize_and_store_learning
```

#### Mode Switching

If the user or model expresses a different intended action during the turn,
the harness will first suggest, then eventually force the model to switch modes.
Either way,
switching resets the system prompt, available operations, and tools.

### Packs

Packs can contain any combination of modes, operations and tools.
Modes are markdown files with YAML front-matter.
Operations are a combination of markdown, Python and YAML.
Tools are a combination of Python and YAML.

There are packs available for agent memory,
agentic coding,
markdown and OKF document generation,
and Linux and Windows shell access.

It's also easy to create your own!

## Using Lisa

The [lisa](https://github.com/Lisa-Harness/lisa) project
is an abstract kernel and runtime.
It is not a host,
i.e.,
it is not a running process or service,
nor does it have a transport.

### Chat

However,
the [lisa-cli](https://github.com/Lisa-Harness/lisa-cli) project
is a runnable host and you can run and chat with Lisa through it,
using its *prompt* sub-command:

```sh
lisa prompt "give me status and next steps"
```

You can also provide command output as input:

```sh
ls mystery_file*.txt | lisa prompt "how did these get here?"
```

### Automation

Lisa also has the `intake` sub-command for passive information processing.
It collects state, processes, and makes it available as input (context) for the next turn.
So, running it on a timer gives the model an arbitrarily up-to-date view of that state.
Then the next turn sees that state as "ambient" context.

## Getting Lisa

Lisa is available as free open-source under the MIT license on
[GitHub](https://github.com/Lisa-Harness).
The kernel,
SDK,
runtime, and built-in packs are in the [lisa](https://github.com/Lisa-Harness/lisa) repository.
The runnable host is in the [lisa-cli](https://github.com/Lisa-Harness/lisa-cli) repository.
The [Getting Started][gettingStartedLink] will help you install it via `pip` or `uv`.
Or just use the [installer](https://github.com/Lisa-Harness/lisa-cli#run-the-installer).
If you build a pack, find a bug, or disagree with a design call,
the issues are open.

The ecosystem will keep making models more capable.
Lisa is a bet on the other half:
making them accountable.
If you have ever wanted an agent that does what it says it will do —
and shows you the receipts when it doesn't —
that is the harness I built.
I hope it becomes yours too.

[cloudServersLink]: https://cloudservers.app
[routerReadmeLink]: https://github.com/Lisa-Harness/lisa/blob/main/sdk/src/sdk/router/README.md
[celDefinitionLink]: https://github.com/cel-expr/cel-spec
[visualStudioCodeLink]: https://code.visualstudio.com/
[gettingStartedLink]: https://github.com/Lisa-Harness/lisa/blob/main/docs/GETTING_STARTED.md
