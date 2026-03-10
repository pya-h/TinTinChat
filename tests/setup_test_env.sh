#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BASE_URL="${1:-http://localhost:8080}"

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "[FAIL] Missing required command: $1" >&2
    exit 1
  }
}

echo "Preparing TinTinChat test environment"
require_cmd php
require_cmd curl
require_cmd bash

mkdir -p "${ROOT_DIR}/uploads/avatars" \
         "${ROOT_DIR}/uploads/images" \
         "${ROOT_DIR}/uploads/files" \
         "${ROOT_DIR}/uploads/stickers" \
         "${ROOT_DIR}/uploads/voice_messages"

echo "[PASS] Upload directories are present"

php -r '
require_once $argv[1] . "/includes/db.php";
$sql = file_get_contents($argv[1] . "/migrations/15_add_user_block_support.sql");
if ($sql === false || trim($sql) === "") {
  fwrite(STDERR, "[FAIL] Unable to read block migration SQL\n");
  exit(1);
}
$pdo->exec($sql);
fwrite(STDOUT, "[PASS] user_blocks migration ensured\n");
' "${ROOT_DIR}"

health_code=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/index.php" || true)
if [[ "${health_code}" == "200" || "${health_code}" == "302" ]]; then
  echo "[PASS] Test server reachable at ${BASE_URL}"
else
  echo "[WARN] Test server not reachable at ${BASE_URL}"
  echo "Start with: php -d upload_max_filesize=110M -d post_max_size=120M -S localhost:8080"
fi

echo "Environment check complete"
