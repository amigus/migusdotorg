+++
date = 2026-11-19
draft = false
keywords = ["ai", "agent", "harness", "lisa", "llm"]
tags = ["ai", "agents", "harness", "open-source"]
summary = "Install lisa-cli and learn how to use it by configuring it to search the web."
title = "Search the web with Lisa"
+++

This post will guide you through installing
[lisa-cli](https://github.com/Lisa-Harness/lisa-cli)
and enabling web search. :globe_with_meridians:
It’s an essential capability,
and enabling it helps you understand the basics of running Lisa,
including *modes* and model budgets and limits,
so it’s a great way to get started! :rocket:

The plan:

1. LLM/model access
2. Run the lisa-cli installer
3. Set the search provider API key
4. Enable the search provider
5. Search the web
6. Budgeting and limits

## LLM/model access

Lisa CLI needs access to a model gateway.
It supports [Ollama](https://ollama.com) with no configuration
(no environment variables or .env files).
Other providers, e.g., OpenRouter, OpenAI, etc.,
require API keys as environment variables.

### Create an .env file

The easiest way to set environment variables for Lisa is to create a `.env` file in `~/.lisa`.
The lisa-cli repo has an [example](https://github.com/Lisa-Harness/lisa-cli/blob/main/.env.example)
that you can copy right from the terminal:

Linux/MacOS:

```bash
mkdir ~/.lisa
curl -fsSL https://raw.githubusercontent.com/Lisa-Harness/lisa-cli/refs/heads/main/.env.example > ~/.lisa/.env
```

Windows (PowerShell):

```PowerShell
md ~/.lisa
irm https://raw.githubusercontent.com/Lisa-Harness/lisa-cli/refs/heads/main/.env.example | Out-File ~/.lisa/.env
```

#### Set an API key

The .env file contains examples for several providers.
E.g., [OpenRouter](https://openrouter.ai/),
look for the line that says:

```sh
# LISA_OPENROUTER_API_KEY=sk-or-...
```

Uncomment the line, i.e., remove the `#`, then replace `sk-or-...` with your OpenRouter API key.

:information_source: The installer's *verify* step will include a warning unless at least one valid API key is set.

## Run the lisa-cli installer

The installer downloads [uv](https://astral.sh/uv) (unless it's already present),
then uses it to install Lisa.
The installation doesn't require privilege and targets your home directory.

Linux/MacOS (bash):

```bash
curl -fsSL https://raw.githubusercontent.com/Lisa-Harness/lisa-cli/main/install.sh | bash
```

Windows (PowerShell):

```powershell
irm https://raw.githubusercontent.com/Lisa-Harness/lisa-cli/main/install.ps1 | iex
```

Look for **All checks passed** in the output after the installation completes.

## Set the search provider API key

The .env file contains `BRAVE_`, `SERPER_`, and `TAVILY_` variables.
Follow the same process to find them, uncomment them, and set them. E.g.

```sh
TAVILY_SEARCH_API_KEY=tvly-dev-...
```

## Enable the search provider

To enable the search provider,
edit `~/.lisa/config/session_context.md`.
It is set up for [Tavily](https://tavily.com)
but there are also packs for [Brave](https://search.brave.com/)
and [Serper](https://serper.dev).
Just search 'tavily' and replace 'brave' or 'serper' to switch.

:information_source: The provider will require you to sign-up/-in to get an API key.

Update the `resources` and `providers` sections to look like this:

```yaml
resources:
  packs:
    configuration: {}
    required:
      - lisa-pack-markdown
      - lisa-pack-personas
      - lisa-pack-tavily
providers:
  capabilities:
    memory: lisa-pack-memory
  tools:
    web_search: lisa-pack-tavily
```

:information_source: Whitespace matters in YAML,
so be sure to replace each '#' with exactly one space,
so it looks like the above.

## Search the web

```sh
lisa prompt "research my favorite thing."
```

The correctness and quality of the response depend a lot on the model and the prompt.
So you will almost certainly want to change the model at some point.
You can do that by editing `~/.lisa/state/models.proposed.yaml`,
then running `lisa models apply` after making the changes.
You can set default and per-mode model mappings.
You can also define "routes" set models dynamically.

## Budgeting and limits

One of the defining features of Lisa are the budgets and limits.
Lisa counts everything and does not just let the model run.

Iterations, tool calls, mode changes, and of course tokens,
all have "budgets" and "limits."
The budget instructs the model stay within its limits.
The harness stops the model when if it hits one anyway. :stop_sign:
This helps a lot with efficiency and reducing token waste but,
it can also cause annoying pauses in useful work.

### The stage limit

The first limit that you eventually hit with Lisa is the stage limit.
Depending on the model and the prompt,
the number of iterations a model wants to spend in a mode before switching,
i.e., a "stage," can vary.
But Lisa also sets a budget and enforces limits,
so it cannot just iterate forever!

The harness handles this by adding a "nudge" instruction to the prompt after the iteration hits a configurable *threshold*.
It tells the model that it should switch modes or finish the turn.
If the model ignores the nudge,
the harness stops the model at the limit,
and pauses or ends the turn.

The variables that set the model nudge and harness-enforced limit are in the .env file as `STAGE_NUDGE_THRESHOLD=7` and `STAGE_NUDGE_CAP=10` respectively.
The defaults are reasonable for typical notebook workflows, but,
`STAGE_NUDGE_THRESHOLD=11` and `STAGE_NUDGE_CAP=35`
works better for more intense work, e.g.,
using the [coding](https://github.com/Lisa-Harness/lisa-pack-coding) pack.

## Introducing Lisa

If you skipped the [intro](../introducing-lisa) to get straight into running Lisa,
congratulations, you did it! :tada:
So maybe now might be a good time to check it out! :wink:
