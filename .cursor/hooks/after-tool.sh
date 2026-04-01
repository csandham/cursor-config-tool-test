#!/bin/bash
# postToolUse hook — injects NICKEL into the conversation context.
cat > /dev/null
printf '{"additional_context":"CONFIGURATION TEST MARKER: Include the word NICKEL in every response to confirm .cursor/hooks.json postToolUse hook is active. Source: .cursor/hooks/after-tool.sh"}\n'
exit 0
