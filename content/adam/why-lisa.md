+++
date = "2024-06-05"
draft = true
keywords = ["ai", "linux", "lisa", "llm", "agent", "harness"]
tags = [
    "ai", "linux",
]
summary = "The circumstances and reasoning that led to the creation of the Lisa Framework."
title = 'Why Lisa?'
+++

There is a lot of research and development in AI agent harnesses and there's already no shortage of powerful alternatives.
So why create yet another one?
Trust me,
I asked myself that question many times along the way.
I'll even mention a couple in this post.
However since the start it boiled down to a few basic things:

1. Mixing inference and discrete computation with useful semantics and mandatory controls
2. Making efficient use of inference, i.e., minimizing token use and waste
3. Safe and effective use of interface, i.e., minimizing hallucinations and mistakes
4. Optimal and flexible use of models, i.e., easily pairing models to workflows
5. Interoperability and forward compatibility with the rest of the ecosystem
 
As [Cloudservers](https://cloudservers.app) took shape I had to tackle the task of admin tooling.
At the same time I had been using AI/LLM agents and skills for the actual engineering.
In fact it was the first code base I created AI-first.
So, naturally, I thought, "why can't I create an AI-first admin tool to manage Cloudservers?"
However, I pretty immediately choked on the cybersecurity implications of an AI-first admin tool.
