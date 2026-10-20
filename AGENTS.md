# Repository instructions for AI agents

## Markdown documentation and content

All markdown files (articles, docs, READMEs) must follow Adam's punctuation-anchored
line-break style. This is a hard format requirement: **never reflow or rewrite the
line breaks** when editing, and **always use it when writing new content**.

- End each line at a sentence or clause boundary — i.e., right **after** a piece of
  punctuation: `.`, `;`, `:`, `,`, `!`, `?`.
- Break after commas (and other mid-sentence punctuation) even mid-clause. Keep each
  line to roughly one thought, not one character count.
- Never hard-wrap because a line got long alone; wrap only at punctuation. Lines may
  be long when there is no punctuation earlier in the sentence.
- One clause per line keeps sentence length down and makes iterative edits and diffs
  easy: each edit touches one idea, and git diffs line up with meaning.
- Blank lines still separate paragraphs, headings, lists, and code blocks.
- List items and quoted content follow the same rule, with continuation lines
  indented to align under the item text.

### Correct example

```markdown
Lisa is an open-source AI agent harness and runtime.
Agent frameworks make models more capable;
almost none make them more accountable.
I built Lisa to close that gap,
with two overarching principles top of mind:
reliability and safety.
```

### Incorrect examples

```markdown
Lisa is an open-source AI agent harness and runtime. Agent frameworks make models
more capable; almost none make them more accountable. I built Lisa to close that
gap, with two overarching principles top of mind: reliability and safety.
```

```markdown
Lisa is an open-source AI agent harness and
runtime. Agent frameworks make models more
capable; almost none make them more
accountable. I built Lisa to close that
gap, with two overarching principles top
of mind: reliability and safety.
```

### Do not rewrap existing content

When making content changes to an existing markdown file, preserve every line break
exactly where it is. Only a line ending in punctuation may gain a follow-on line, and
only by breaking at the next punctuation in the new text. Never merge lines, never
re-break lines that already break at punctuation, and never introduce column-based
wrapping. If a rewrite produces prose that is not formatted this way, reformat it into
this style before finishing.
