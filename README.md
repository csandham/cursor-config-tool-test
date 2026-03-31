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

### Single-shot test (6 magic words)

Paste the prompt from [TEST-PROMPT.md](TEST-PROMPT.md) into the Cursor chat. Tests BASALT, MARBLE, JASPER, FALCON, OCELOT, and VERMILLION in one shot.

### Manual tests (4 magic words)

These require user interaction and cannot be tested in a single prompt:

- **TUNGSTEN** — Open a brand-new Cursor chat after configuring the hook; the `sessionStart` hook only fires at session start
- **TITANIUM** — Type `@manual-review` in chat to @-mention the manual rule file
- **ONYX** — Read the `config-test://status` MCP resource via `FetchMcpResource`

See [TEST-PROMPT.md](TEST-PROMPT.md) for detailed instructions.

## Results

| Config feature                                      | Cursor | Claude Code | Windsurf | GitHub Copilot |
|-----------------------------------------------------|--------|-------------|----------|----------------|
| BASALT — `AGENTS.md`                                | ✅     |             |          |                |
| MARBLE — `.cursor/rules/` (alwaysApply)             | ✅     |             |          |                |
| JASPER — `.cursor/rules/` (agent-requested)         | ✅     |             |          |                |
| TITANIUM — `.cursor/rules/` (manual @-mention)      | ✅     |             |          |                |
| FALCON — `.cursor/mcp.json` (tool)                  | ✅     |             |          |                |
| ONYX — `.cursor/mcp.json` (resource)                | ✅     |             |          |                |
| OCELOT — `.cursor/skills/`                          | ✅     |             |          |                |
| VERMILLION — `.cursor/agents/`                      | ✅     |             |          |                |
| TUNGSTEN — `.cursor/hooks.json` (sessionStart)      | ✅     |             |          |                |

Legend: ✅ confirmed · ❌ not supported · ⚠️ inconclusive (see notes below) · blank = untested

### Cursor — test notes (2026-03-27)

All 9 configuration layers confirmed in a single test session. Every Cursor-native primitive is active and functioning.

**TUNGSTEN — sessionStart hook** fires at the start of a new agent session and injects context via `additional_context` stdout output. The `hooks.json` config uses `version: 1` with an object-style `hooks` map. Hook scripts must be executable (`chmod +x`). This hook does not re-run mid-conversation — open a brand-new Cursor chat to trigger it.

**TITANIUM — manual @-mention rule** confirmed by @-mentioning `.cursor/rules/manual-review.mdc` directly in chat. Rules with no frontmatter are inert until explicitly referenced.

**ONYX — MCP resource** confirmed by reading `config-test://status` via `FetchMcpResource`. Both MCP primitives (tools and resources) are fully supported.

## Repository structure

```
.
├── AGENTS.md                                # Root instructions (BASALT)
├── README.md                                # Documentation and results
├── TEST-PROMPT.md                           # Test prompts
└── .cursor/
    ├── mcp.json                             # MCP server registration
    ├── hooks.json                           # Agent loop hooks config
    ├── rules/
    │   ├── core.mdc                         # Always-applied rules (MARBLE)
    │   ├── security.mdc                     # Agent-requested rules (JASPER)
    │   ├── testing.mdc                      # Glob auto-attached for test files (unreliable)
    │   └── manual-review.mdc               # Manual @-mention rules (TITANIUM)
    ├── skills/
    │   ├── onboarding/SKILL.md              # Onboarding skill (OCELOT)
    │   ├── debugging/SKILL.md               # Debugging playbook
    │   └── release/SKILL.md                 # Release process playbook
    ├── agents/
    │   ├── reviewer.md                      # Reviewer subagent (VERMILLION)
    │   └── architect.md                     # Architect subagent
    ├── hooks/
    │   └── audit.sh                         # Hook script: logs all agent events to /tmp/
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
