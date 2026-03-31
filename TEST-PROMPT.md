# Cursor Configuration Test

This file contains test prompts for validating which Cursor-native configuration features
are supported by the current IDE. Each feature embeds a unique magic word. The presence of
a word in a response proves that configuration was loaded or invoked.

See [README.md](README.md) for the full magic word legend and results table.

---

## Setup

### MCP test dependency

```bash
cd .cursor/mcp-servers && npm install
```

### Verify MCP server starts

```bash
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | node .cursor/mcp-servers/config-test-server.js
```

### Cursor settings

Cursor may require the **"Include third-party Plugins, Skills, and other configs"** setting
to be enabled for some configuration files to be loaded.

---

## Single-Shot Test (6 magic words)

**Note:** TUNGSTEN requires a fresh session — see the separate manual test below.

Paste the following prompt into the IDE chat:

---

```
Please run a comprehensive Cursor configuration test by completing all of the following steps in order:

1. Note any configuration keywords you have automatically been instructed to include — look for words like BASALT, MARBLE, JASPER, and TUNGSTEN already present in your instructions or auto-loaded rules.
2. Use the reviewer agent to verify subagent support.
3. Invoke the cursor-config-test skill (onboarding skill).
4. Call the cursor_config_test MCP tool.

After completing all steps, produce a results table:

| Magic Word | Expected Source                                                   | Detected? |
|------------|-------------------------------------------------------------------|-----------|
| BASALT     | AGENTS.md — auto-loaded                                           |           |
| MARBLE     | .cursor/rules/core.mdc — always-applied (alwaysApply)             |           |
| JASPER     | .cursor/rules/security.mdc — agent-requested (description)        |           |
| FALCON     | .cursor/mcp.json — cursor_config_test MCP tool                    |           |
| OCELOT     | .cursor/skills/onboarding/ (skill)                                |           |
| VERMILLION | .cursor/agents/reviewer.md (agent)                                |           |

For each word, mark ✅ if it appeared at any point during this test, or ❌ if not detected.
For each ❌, add: "[WORD] NOT DETECTED — [config type] is not supported or not loaded by this IDE."
```

---

## Manual Test: TUNGSTEN (sessionStart hook)

TUNGSTEN tests whether `.cursor/hooks.json` `sessionStart` hooks can inject `additional_context` into the AI's system context.

> 1. Ensure `.cursor/hooks/session-start.sh` is executable: `chmod +x .cursor/hooks/session-start.sh`
> 2. **Open a brand-new Cursor chat** (do not resume this one — the hook only fires at session start)
> 3. Ask anything, e.g. "What magic word has been injected into your context?"
>
> **Pass:** TUNGSTEN appears in the response.
> **Fail:** Hook did not fire or `additional_context` is not supported — sessionStart hooks are not active in this IDE.

---

## Manual Test: TITANIUM (rule @-mention)

TITANIUM tests whether `.cursor/rules/` files with no frontmatter can be loaded via @-mention.

> Type `@manual-review` in the chat input to reference `.cursor/rules/manual-review.mdc`,
> then ask: "What magic word does this rule contain?"
>
> **Pass:** TITANIUM appears in the response.
> **Fail:** File not recognized or not loadable via @-mention.

---

## Manual Test: ONYX (MCP resource)

ONYX tests whether MCP resources (not just tools) can be read by the IDE.

> Ask the AI: "Read the MCP resource at config-test://status from the cursor-config-test server."
>
> **Pass:** ONYX appears in the response.
> **Fail:** Resource not accessible — MCP resource support is not available in this IDE.

---

## Concepts Not Directly Testable

| Concept | Why no magic word | How to verify manually |
|---------|-------------------|------------------------|
| Editor settings (`.cursor/settings.json`) | Affects editor behavior, not AI text output | Check if settings take effect in the UI |
| User-level rules (`~/.cursor/rules/`) | Machine-specific, not portable in a repo | Create a user-level rule and check if it loads |
| User-level skills (`~/.cursor/skills/`) | Machine-specific, not portable in a repo | Create a user-level skill and invoke it |
