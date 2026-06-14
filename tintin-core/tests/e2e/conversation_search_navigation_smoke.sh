#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SEARCH_JS="${ROOT_DIR}/../public/assets/js/chat-conversation-search.js"

if [[ ! -f "${SEARCH_JS}" ]]; then
  echo "[FAIL] Missing ${SEARCH_JS}" >&2
  exit 1
fi

echo "Running conversation search navigation contract smoke checks"

require_pattern() {
  local pattern="$1"
  local label="$2"
  if grep -Eq "$pattern" "${SEARCH_JS}"; then
    echo "[PASS] ${label}"
  else
    echo "[FAIL] ${label}" >&2
    exit 1
  fi
}

# Core cursor model contract: newest-first by message id, cursor starts at most recent
require_pattern 'conversationSearchMatchMsgIds\s*=\s*\[\]' 'Search results are tracked as message-id array'
require_pattern 'conversationSearchCursor\s*=\s*-1' 'Search cursor state is defined'
require_pattern 'conversationSearchCursor\s*=\s*0' 'Search starts from most recent match (cursor=0)'
require_pattern 'matchedIds\.sort\(\(a, b\) => a - b\);' 'Matches sort ascending before reverse'
require_pattern 'matchedIds\.reverse\(\);' 'Matches reverse to newest-first order'

# Direction contract: Up/Prev => older (cursor++), Down/Next => newer (cursor--)
require_pattern 'direction = -1 .*older.*cursor\+\+' 'Direction docs define Up/Prev as older'
require_pattern 'direction = \+1 .*newer.*cursor--' 'Direction docs define Down/Next as newer'
require_pattern 'conversationSearchPrevBtn\?\.addEventListener\("click"' 'Prev button click handler exists'
require_pattern 'void navigateConversationSearch\(-1\);' 'Prev button navigates older matches'
require_pattern 'conversationSearchNextBtn\?\.addEventListener\("click"' 'Next button click handler exists'
require_pattern 'void navigateConversationSearch\(1\);' 'Next button navigates newer matches'

# No-wrap behavior at boundaries
require_pattern 'if \(conversationSearchCursor <= 0\) \{' 'Newest boundary guard condition exists'
require_pattern 'return; // already at newest; no wraparound' 'No wraparound at newest boundary'
require_pattern 'if \(!hasMoreMessages\) \{' 'Oldest boundary guard condition exists'
require_pattern 'return; // no more pages; no wraparound' 'No wraparound at oldest boundary when fully loaded'

# Critical behavior: keep loading older pages until next older match exists
require_pattern 'while \(hasMoreMessages && !foundOlder && safety < 180\)' 'Older navigation can iterate across multiple pages'
require_pattern 'await loadMessages\(currentChatUser, false, false\);' 'Older navigation loads older messages on demand'
require_pattern 'const oldIdxProbe = conversationSearchMatchMsgIds\.indexOf\(' 'Older navigation tracks previous oldest match id'
require_pattern 'oldIdxProbe \+ 1 < conversationSearchMatchMsgIds\.length' 'Older navigation advances only when a truly older match is found'

# Scrolling contract: standards-safe behavior + precise centering pass
require_pattern 'scrollIntoView\(\{ behavior: "auto", block: "center" \}\)' 'Search uses standards-safe scroll behavior'
require_pattern 'chatMessagesElem\.scrollTop \+= delta;' 'Search applies fine-tuned center correction'

# Wildcard guard contract: %/_ only queries are blocked to avoid pathological scans
require_pattern 'normalizedQuery\.replace\(/\[\\s%_\]/g, ""\)\.length === 0' 'Wildcard-only query guard exists'
require_pattern 'Search placeholders need at least one non-placeholder character' 'Wildcard-only query user warning exists'

echo "All conversation search navigation smoke checks passed"
