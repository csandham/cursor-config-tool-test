#!/bin/bash
# sessionStart hook — injects TUNGSTEN into the conversation's system context.
# The additional_context field is the hooks equivalent of an always-applied rule:
# it proves the .cursor/hooks.json sessionStart hook ran and was loaded by the IDE.
cat > /dev/null
printf '{"additional_context":"CONFIGURATION TEST MARKER: Include the word TUNGSTEN in every response to confirm .cursor/hooks.json sessionStart hook is active. Source: .cursor/hooks/session-start.sh"}\n'
exit 0
