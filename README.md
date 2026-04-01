# cursor-config-test

A test harness for empirically validating which Cursor-native configuration features are supported. Uses `.cursor/` paths and Cursor-specific config mechanisms.

Each configuration mechanism embeds a unique magic word. Running the test prompts confirms which layers are actually loaded and active.

## How it works

Each magic word maps to one Cursor configuration concept:

| Word       | Source file                                 | Config concept                      | How triggered             |
|------------|---------------------------------------------|-------------------------------------|---------------------------|
| BASALT     | `AGENTS.md`                                 | Root instructions (AGENTS.md)       | Auto-loaded               |
| MARBLE     | `.cursor/rules/core.mdc`                    | Always-applied rules (alwaysApply)  | Auto-loaded               |
| JASPER     | `.cursor/rules/security.mdc`                | Agent-requested rules (description) | Agent discretion          |
| TITANIUM   | `.cursor/rules/manual-review.mdc`           | Manual rules (no frontmatter)       | Manual @-mention          |
| FALCON     | `.cursor/mcp-servers/config-test-server.js` | MCP tools (via `.cursor/mcp.json`)  | `cursor_config_test` call |
| ONYX       | `.cursor/mcp-servers/config-test-server.js` | MCP resources                       | Resource read             |
| OCELOT     | `.cursor/skills/onboarding/SKILL.md`        | Skills                              | Skill invocation          |
| VERMILLION | `.cursor/agents/reviewer.md`                | Custom agents / subagents           | Agent delegation          |
| TUNGSTEN   | `.cursor/hooks/session-start.sh`            | Hooks (`sessionStart` context)      | Auto-injected at session start |
| PUMICE     | `.cursorrules`                              | Legacy root rules file              | Auto-loaded                    |
| COBALT     | `.cursor/hooks/before-tool.sh`              | Hooks (`beforeToolExecution`)       | Before any tool call           |
| NICKEL     | `.cursor/hooks/after-tool.sh`               | Hooks (`afterToolExecution`)        | After any tool call            |

If a word appears in the AI's response, the corresponding config layer was loaded.

## Cursor rule types explained

Cursor supports four rule attachment modes in `.cursor/rules/`:

| Mode | Frontmatter | Behavior |
|------|-------------|----------|
| **Always-applied** | `alwaysApply: true` | Loaded into every conversation automatically |
| **Agent-requested** | `description: "..."` only | Agent decides whether to fetch based on description relevance |
| **Manual** | No frontmatter | Only loaded when explicitly @-mentioned by the user |

> **Note:** Auto-attached rules (`globs`) are not reliably supported in Cursor as of early 2026. The glob-attached rule type is documented in Cursor's API but has known reliability issues — see [Cursor forum reports](https://forum.cursor.com/t/bug-auto-attached-rules-fail-to-load-detect-in-cursor-49-6/85456). Use `alwaysApply: true` or `AGENTS.md` for reliable context injection.

## Setup

### MCP server dependency

```bash
cd .cursor/mcp-servers && npm install
```

### Verify MCP server starts

```bash
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | node .cursor/mcp-servers/config-test-server.js
```

You should see a JSON response listing the `cursor_config_test` tool.

### Cursor settings

Cursor may require the **"Include third-party Plugins, Skills, and other configs"** setting to be enabled for some configuration files to be loaded.

## Running the test

### Single-shot test (12 magic words)

Paste the prompt from [TEST-PROMPT.md](TEST-PROMPT.md) into a **brand-new Cursor chat**. Tests all 12 magic words in one shot: BASALT, MARBLE, JASPER, TITANIUM, PUMICE, FALCON, ONYX, OCELOT, VERMILLION, TUNGSTEN, COBALT, and NICKEL. A fresh session is required so the `sessionStart` hook fires (TUNGSTEN). The `preToolUse` and `postToolUse` hooks (COBALT, NICKEL) fire automatically during the tool calls the test performs. The prompt begins with `@manual-review` to test manual @-mention rule loading (TITANIUM) — ensure Cursor resolves the @-mention when pasting.

See [TEST-PROMPT.md](TEST-PROMPT.md) for detailed instructions.

## Results

| Config feature                                      | Cursor | Claude Code | Windsurf | GitHub Copilot |
|-----------------------------------------------------|--------|-------------|----------|----------------|
| BASALT — `AGENTS.md`                                | ✅     | ❌          | ✅       | ✅             |
| MARBLE — `.cursor/rules/` (alwaysApply)             | ✅     | ❌          | ✅       | ❌             |
| JASPER — `.cursor/rules/` (agent-requested)         | ✅     | ❌          | ✅       | ❌             |
| TITANIUM — `.cursor/rules/` (manual @-mention)      | ✅     | ❌          | ✅       | ❌             |
| FALCON — `.cursor/mcp.json` (tool)                  | ✅     | ❌          | ❌       | ❌             |
| ONYX — `.cursor/mcp.json` (resource)                | ✅     | ❌          | ❌       | ❌             |
| OCELOT — `.cursor/skills/`                          | ✅     | ❌          | ✅       | ❌             |
| VERMILLION — `.cursor/agents/`                      | ✅     | ❌          | ❌       | ❌             |
| TUNGSTEN — `.cursor/hooks.json` (sessionStart)      | ✅     | ❌          | ❌       | ❌             |
| PUMICE — `.cursorrules` (legacy)                     | ✅     | ❌          | ✅       | ❌             |
| COBALT — `.cursor/hooks.json` (preToolUse)           | ✅     | ❌          | ❌       | ❌             |
| NICKEL — `.cursor/hooks.json` (postToolUse)          | ✅     | ❌          | ❌       | ❌             |

Legend: ✅ confirmed · ❌ not supported · ⚠️ inconclusive (see notes below) · blank = untested

### Cursor — test notes (2026-04-01)

All 12 magic words confirmed in a single-shot test session (brand-new chat). Every Cursor-native primitive is active and functioning.

**PUMICE — legacy `.cursorrules`** auto-loaded alongside `AGENTS.md` and `.cursor/rules/`. Cursor still supports the legacy root rules file.

**COBALT / NICKEL — preToolUse / postToolUse hooks** fire automatically during every tool call. `preToolUse` injects via `agent_message` (with `permission: "allow"`); `postToolUse` injects via `additional_context`. Both confirmed during the MCP, agent, and skill tool calls in the single-shot test.

**TUNGSTEN — sessionStart hook** fires at the start of a new agent session and injects context via `additional_context` stdout output. The `hooks.json` config uses `version: 1` with an object-style `hooks` map. Hook scripts must be executable (`chmod +x`). This hook does not re-run mid-conversation — open a brand-new Cursor chat to trigger it.

**TITANIUM — manual @-mention rule** confirmed by @-mentioning `.cursor/rules/manual-review.mdc` directly in chat. Rules with no frontmatter are inert until explicitly referenced.

**ONYX — MCP resource** confirmed by reading `config-test://status` via `FetchMcpResource`. Both MCP primitives (tools and resources) are fully supported.

### Claude Code (VS Code Extension) — test notes (2026-04-01)

0 of 12 magic words detected. None of the Cursor-native configuration primitives are supported.

**BASALT — `AGENTS.md`** not loaded. Claude Code does not auto-load `AGENTS.md` from the repository root. Claude Code uses `.claude/` for project-specific configuration, not Cursor's `AGENTS.md` convention.

**MARBLE / JASPER / TITANIUM — `.cursor/rules/`** not loaded. Claude Code does not read `.cursor/rules/*.mdc` files. The equivalent in Claude Code is `CLAUDE.md` files at the repository root or in subdirectories.

**PUMICE — `.cursorrules`** not loaded. The legacy `.cursorrules` file is Cursor-specific and not recognized by Claude Code.

**FALCON / ONYX — `.cursor/mcp.json`** not loaded. Claude Code does not read project-local MCP config from `.cursor/mcp.json`. MCP servers in Claude Code are configured globally via `.claude/settings.json` or VS Code user settings.

**OCELOT — `.cursor/skills/`** not supported. Claude Code has a different skill system that does not use `.cursor/skills/` directory. Skills in Claude Code are defined in `.claude/` or loaded via extensions.

**VERMILLION — `.cursor/agents/`** not supported. Claude Code has its own agent system (general-purpose, Explore, Plan, claude-code-guide) but does not load custom agents from `.cursor/agents/`. The agent type 'reviewer' was not found.

**TUNGSTEN / COBALT / NICKEL — `.cursor/hooks.json`** not supported. Claude Code does not implement Cursor's hook system. Claude Code has its own hook mechanism configured via `.claude/settings.json`.

**Conclusion:** The `.cursor/` directory structure and all Cursor-specific configuration mechanisms are proprietary to Cursor IDE. Claude Code uses a completely different configuration system centered around `.claude/` directories and `CLAUDE.md` files.

### GitHub Copilot (VS Code) — test notes (2026-04-01)

1 of 12 magic words detected. Only `AGENTS.md` auto-loading is supported. All Cursor-native configuration primitives are unsupported.

**BASALT — `AGENTS.md`** auto-loaded as an attachment in the agent's system instructions. This is the only shared config mechanism between Cursor and GitHub Copilot.

**MARBLE / JASPER / TITANIUM — `.cursor/rules/`** not loaded. VS Code does not read `.cursor/rules/*.mdc` files. The equivalent in GitHub Copilot is `.github/copilot-instructions.md` and `.instructions.md` files.

**PUMICE — `.cursorrules`** not loaded. Legacy root rules are Cursor-specific.

**FALCON / ONYX — `.cursor/mcp.json`** not loaded. VS Code does not read project-local MCP config from `.cursor/mcp.json`. MCP servers must be configured via VS Code settings (`mcp` section in `settings.json`).

**OCELOT — `.cursor/skills/`** not supported. No equivalent skill system exists in GitHub Copilot. The closest equivalent is custom instructions via `.instructions.md` files or prompt files (`.prompt.md`).

**VERMILLION — `.cursor/agents/`** not supported. GitHub Copilot uses `.agent.md` files for custom agent modes, not `.cursor/agents/`.

**TUNGSTEN / COBALT / NICKEL — `.cursor/hooks.json`** not supported. VS Code has no agent hook system equivalent.

### Windsurf — test notes (2026-04-01)

6 of 12 magic words detected. Basic Cursor configuration files and skills are supported, but MCP servers, subagents, and hooks are not supported.

**BASALT — `AGENTS.md`** auto-loaded and active. Windsurf supports Cursor's root instructions file.

**MARBLE / JASPER / TITANIUM — `.cursor/rules/`** all loaded successfully. Windsurf supports Cursor's rule system including always-applied, agent-requested, and manual @-mention rules.

**PUMICE — `.cursorrules`** auto-loaded alongside other config files. Windsurf supports Cursor's legacy root rules file.

**OCELOT — `.cursor/skills/`** successfully invoked. Windsurf supports Cursor's skill system.

**FALCON / ONYX — `.cursor/mcp.json`** not loaded. Windsurf does not support project-local MCP server configuration from `.cursor/mcp.json`.

**VERMILLION — `.cursor/agents/`** not supported. Windsurf does not support Cursor's custom agent system.

**TUNGSTEN / COBALT / NICKEL — `.cursor/hooks.json`** not supported. Windsurf does not implement Cursor's hook system.

**Conclusion:** Windsurf provides partial compatibility with Cursor's configuration system, supporting basic files (AGENTS.md, .cursorrules, .cursor/rules/, .cursor/skills/) but lacking support for advanced features like MCP servers, custom agents, and hooks.

## Repository structure

```
.
├── AGENTS.md                                # Root instructions (BASALT)
├── .cursorrules                             # Legacy root rules (PUMICE)
├── README.md                                # Documentation and results
├── TEST-PROMPT.md                           # Test prompts
└── .cursor/
    ├── mcp.json                             # MCP server registration
    ├── hooks.json                           # Agent loop hooks config
    ├── rules/
    │   ├── core.mdc                         # Always-applied rules (MARBLE)
    │   ├── security.mdc                     # Agent-requested rules (JASPER)
    │   └── manual-review.mdc               # Manual @-mention rules (TITANIUM)
    ├── skills/
    │   ├── onboarding/SKILL.md              # Onboarding skill (OCELOT)
    │   ├── debugging/SKILL.md               # Debugging playbook
    │   └── release/SKILL.md                 # Release process playbook
    ├── agents/
    │   ├── reviewer.md                      # Reviewer subagent (VERMILLION)
    │   └── architect.md                     # Architect subagent
    ├── hooks/
    │   ├── audit.sh                         # Hook script: logs all agent events to /tmp/
    │   ├── before-tool.sh                   # beforeToolExecution hook (COBALT)
    │   └── after-tool.sh                    # afterToolExecution hook (NICKEL)
    └── mcp-servers/
        └── config-test-server.js            # MCP tool (FALCON) + resource (ONYX)
```

## Notes

### hooks.json format

The hooks config requires `version: 1` and an object-style `hooks` map (keyed by event name, not an array):

```json
{
  "version": 1,
  "hooks": {
    "sessionStart": [{ "command": ".cursor/hooks/session-start.sh" }],
    "afterFileEdit": [{ "command": ".cursor/hooks/audit.sh" }]
  }
}
```

Hook scripts must be executable (`chmod +x`). See [Cursor hooks docs](https://cursor.com/docs/agent/hooks) for the full list of lifecycle events.

The `sessionStart` hook supports an `additional_context` output field that injects text into the conversation's initial system context — this is how TUNGSTEN is surfaced to the AI.
