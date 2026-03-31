#!/bin/bash
# Reads all hook input from stdin and appends it as a timestamped entry to the audit log.
# Exits 0 so the agent proceeds normally (fail-open).
LOG_FILE="/tmp/cursor-config-test-audit.log"
echo "--- $(date -u +"%Y-%m-%dT%H:%M:%SZ") hook=$CURSOR_HOOK_NAME ---" >> "$LOG_FILE"
cat >> "$LOG_FILE"
echo "" >> "$LOG_FILE"
exit 0
