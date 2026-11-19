+++
title = 'Lisa'
keywords = ['lisa']
summary = 'Posts about Lisa, an open-source AI agent harness and MCP-based runtime.'
+++

[Lisa Harness](https://github.com/Lisa-Harness) is an open-source AI agent and runtime.
It is designed to run models with varying degrees of implicit trust starting from zero.
It accomplishes that by:

- Giving the model iteration and tool calling budgets and limits. :stopwatch:
- Managing the model's context window to keep it on task. :railway_track:
- Verifying the model's deliverables with intent receipts. :receipt:

It's kernel, SDK, and MCP-based runtime architecture make it modular and composable.
The runtime needs a host to access models, run MCP servers and load packs;
[lisa-cli](https://github.com/Lisa-Harness/lisa-cli) is a runtime host.
It manages model gateway/proxies MCP servers, and loads packs.

## Posts
