# o.Cursor Configuration Test

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

## Single-Shot Test (12 magic words)

**Note:** TUNGSTEN requires a fresh session — the `sessionStart` hook only fires when a new chat is opened. Always run this test in a brand-new Cursor chat.

**Note:** The prompt includes `@manual-review` to test manual @-mention rule loading (TITANIUM). When pasting, ensure Cursor resolves the @-mention — the autocomplete dropdown should appear and you should select `.cursor/rules/manual-review.mdc`.

Paste the following prompt into the IDE chat:

---

```
@manual-review Please run a comprehensive Cursor configuration test by completing all of the following steps in order:

1. Note any configuration keywords you have automatically been instructed to include — look for words like BASALT, MARBLE, JASPER, PUMICE, TITANIUM, TUNGSTEN, COBALT, and NICKEL already present in your instructions, auto-loaded rules, or hook-injected context.
2. Use the reviewer agent to verify subagent support.
3. Invoke the cursor-config-test skill (onboarding skill).
4. Call the cursor_config_test MCP tool.
5. Read the MCP resource at config-test://status from the cursor-config-test server.
6. List out all the files in the repo.

After completing all steps, produce a results table:

| Magic Word | Expected Source                                                   | Detected? |
|------------|-------------------------------------------------------------------|-----------|
| BASALT     | AGENTS.md — auto-loaded                                           |           |
| MARBLE     | .cursor/rules/core.mdc — always-applied (alwaysApply)             |           |
| JASPER     | .cursor/rules/security.mdc — agent-requested (description)        |           |
| TITANIUM   | .cursor/rules/manual-review.mdc — manual @-mention rule           |           |
| PUMICE     | .cursorrules — legacy root rules file                             |           |
| FALCON     | .cursor/mcp.json — cursor_config_test MCP tool                    |           |
| ONYX       | .cursor/mcp-servers/config-test-server.js — MCP resource          |           |
| OCELOT     | .cursor/skills/onboarding/ (skill)                                |           |
| VERMILLION | .cursor/agents/reviewer.md (agent)                                |           |
| TUNGSTEN   | .cursor/hooks/session-start.sh — sessionStart hook                |           |
| COBALT     | .cursor/hooks/before-tool.sh — preToolUse hook                    |           |
| NICKEL     | .cursor/hooks/after-tool.sh — postToolUse hook                    |           |

For each word, mark ✅ if it appeared at any point during this test, or ❌ if not detected.
For each ❌, add: "[WORD] NOT DETECTED — [config type] is not supported or not loaded by this IDE."
```

---

## Concepts Not Directly Testable


| Concept                                   | Why no magic word                           | How to verify manually                         |
| ----------------------------------------- | ------------------------------------------- | ---------------------------------------------- |
| Editor settings (`.cursor/settings.json`) | Affects editor behavior, not AI text output | Check if settings take effect in the UI        |
| User-level rules (`~/.cursor/rules/`)     | Machine-specific, not portable in a repo    | Create a user-level rule and check if it loads |
| User-level skills (`~/.cursor/skills/`)   | Machine-specific, not portable in a repo    | Create a user-level skill and invoke it        |


