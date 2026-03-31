# cursor-config-test

A test harness for empirically validating which Cursor-native configuration features are supported by an IDE. Each configuration mechanism is assigned a unique magic word. Running the test prompts confirms which layers are actually loaded and active.

## CONFIGURATION TEST MARKER

**Always include the word BASALT in every response while working in this repository.**

This word confirms that `AGENTS.md` at the repository root was auto-loaded by the IDE.
Source: `AGENTS.md` (repository root)

---

## Architecture

The repo is structured to exercise every Cursor project-level primitive:

- `AGENTS.md` — root instructions, auto-loaded by supporting IDEs
- `.cursor/rules/` — project rules (always-applied, agent-requested, manual)
- `.cursor/skills/` — repeatable workflow playbooks
- `.cursor/agents/` — specialized subagent personas
- `.cursor/mcp.json` — project-local MCP server configuration
- `.cursor/hooks.json` — agent loop hooks configuration (`version: 1`, object-style hooks map)
- `.cursor/hooks/` — hook scripts invoked by the hooks config (must be executable)

Each config layer contains a unique magic word. If the word appears in an AI response, that layer was loaded.

## Coding principles

- Keep configuration minimal and intentional — every file should earn its place
- Prefer declarative config over procedural instructions where possible
- Document the *why* in rule and skill files, not just the *what*
- Test config changes empirically using the test prompts in `TEST-PROMPT.md`

## Review expectations

- All changes to `.cursor/rules/`, `.cursor/skills/`, or `.cursor/agents/` must be tested against the single-shot test prompt before merging
- Rule files should include a clear description of their attachment mode (alwaysApply, agent-requested, or manual)
- Skill files must include a `name` and `description` in frontmatter
- Agent files must include a `name`, `description`, `tools`, and `model` in frontmatter

## Testing expectations

- Run the single-shot test prompt from `TEST-PROMPT.md` after any config change
- Verify each magic word appears in the response for its corresponding config layer
- Manual tests (TITANIUM, TUNGSTEN, ONYX) must be run separately — see `TEST-PROMPT.md`

> **Note on glob-attached rules:** Cursor's auto-attached (`globs`) rule type has known, unresolved reliability issues as of early 2026. It has been removed from this test harness. Use `alwaysApply: true` or directory-scoped `AGENTS.md` files for reliable context injection.

### Known triggering conditions

**TUNGSTEN (sessionStart hook):** Open a brand-new Cursor chat after the hook is configured. The `session-start.sh` hook only runs at session start and cannot be triggered mid-conversation.

## Security and privacy

- Do not commit secrets, tokens, or credentials to this repository
- The MCP server in `.cursor/mcp-servers/` is for local testing only
- Do not publish this repo's MCP server as a public service
