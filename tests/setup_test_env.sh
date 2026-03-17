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
$migrations = [
  ["15_add_user_block_support.sql", "user_blocks migration ensured"],
  ["16_add_message_edit_support.sql", "message edit migration ensured"],
  ["17_add_group_seen_unread_support.sql", "group seen/unread migration ensured"],
  ["18_add_sticker_admin_only_support.sql", "sticker admin-only migration ensured"],
];

foreach ($migrations as [$fileName, $label]) {
  $sql = file_get_contents($argv[1] . "/migrations/" . $fileName);
  if ($sql === false || trim($sql) === "") {
    fwrite(STDERR, "[FAIL] Unable to read migration SQL: {$fileName}\n");
    exit(1);
  }

  try {
    $pdo->exec($sql);
  } catch (PDOException $exception) {
    $errorCode = (string) ($exception->errorInfo[1] ?? "");
    if (!in_array($errorCode, ["1060", "1061", "1050"], true)) {
      throw $exception;
    }
  }

  fwrite(STDOUT, "[PASS] {$label}\n");
}

' "${ROOT_DIR}"

health_code=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/index.php" || true)
if [[ "${health_code}" == "200" || "${health_code}" == "302" ]]; then
  echo "[PASS] Test server reachable at ${BASE_URL}"
else
  echo "[WARN] Test server not reachable at ${BASE_URL}"
  echo "Start with: php -d upload_max_filesize=110M -d post_max_size=120M -S localhost:8080"
fi

echo "Environment check complete"
