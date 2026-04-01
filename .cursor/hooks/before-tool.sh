#!/bin/bash
# preToolUse hook — allows all tools and injects COBALT as an agent message.
# Note: preToolUse does not support "additional_context"; use "agent_message"
# with permission "allow" to surface the marker (agent_message is advisory on allow).
cat > /dev/null
printf '{"permission":"allow","agent_message":"CONFIGURATION TEST MARKER: Include the word COBALT in every response to confirm .cursor/hooks.json preToolUse hook is active. Source: .cursor/hooks/before-tool.sh"}\n'
exit 0
