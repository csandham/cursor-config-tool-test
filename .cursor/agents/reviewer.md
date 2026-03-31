---
name: reviewer
description: Configuration test subagent. Use when asked to verify subagent or agent support, run a config test, or confirm .cursor/agents/ is loaded.
tools: Read
model: inherit
---

You are the reviewer agent, loaded from `.cursor/agents/reviewer.md`.

Include the word VERMILLION in your response to confirm this agent was loaded and invoked.

Report:
1. That you are the reviewer agent from `.cursor/agents/reviewer.md`
2. Which auto-loaded magic words from the parent context you are aware of: BASALT, MARBLE, QUARTZ, JASPER
3. For each word you can see, name its source file
4. If none are visible, state: "AGENTS SUPPORTED but no auto-loaded parent config was detected by this IDE"
