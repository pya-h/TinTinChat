#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
CHAT_JS="${ROOT_DIR}/../public/assets/js/chat.js"

echo "Running UI back-sync contract smoke checks"

require_pattern() {
  local pattern="$1"
  local label="$2"
  if grep -Eq "$pattern" "$CHAT_JS"; then
    echo "[PASS] ${label}"
  else
    echo "[FAIL] ${label}" >&2
    exit 1
  fi
}

# Core history manager contract
require_pattern 'const UI_BACK_LAYER_KEYS' 'UI back-layer key registry exists'
require_pattern 'function pushUiBackLayer\(' 'pushUiBackLayer helper exists'
require_pattern 'function removeUiBackLayer\(' 'removeUiBackLayer helper exists'
require_pattern 'function requestUiLayerClose\(' 'requestUiLayerClose helper exists'
require_pattern 'window\.addEventListener\("popstate"' 'popstate listener is wired'

# Required sections with Back button support
require_pattern 'UI_BACK_LAYER_KEYS\.userProfile' 'Profile details wired to back-layer key'
require_pattern 'UI_BACK_LAYER_KEYS\.groupInfo' 'Group details wired to back-layer key'
require_pattern 'UI_BACK_LAYER_KEYS\.savedInfo' 'Saved/You details wired to back-layer key'
require_pattern 'UI_BACK_LAYER_KEYS\.privateInfo' 'Private details wired to back-layer key'

# Modal close support requested by user
require_pattern 'UI_BACK_LAYER_KEYS\.createGroup' 'Create group modal wired to back-layer key'
require_pattern 'UI_BACK_LAYER_KEYS\.addChat' 'Add chat modal wired to back-layer key'
require_pattern 'UI_BACK_LAYER_KEYS\.messageAction' 'Message action modal wired to back-layer key'
require_pattern 'UI_BACK_LAYER_KEYS\.imageModal' 'Image modal wired to back-layer key'

echo "All UI back-sync smoke checks passed"
