#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-http://localhost:8080}"
WORK_DIR="$(mktemp -d)"
COOKIE_A="${WORK_DIR}/user_a.cookies"
COOKIE_B="${WORK_DIR}/user_b.cookies"
INDEX_A="${WORK_DIR}/index_a.html"
INDEX_B="${WORK_DIR}/index_b.html"
DASH_A="${WORK_DIR}/dash_a.html"
RESP_SEND="${WORK_DIR}/send.json"
RESP_FETCH="${WORK_DIR}/fetch.json"
RESP_REACT="${WORK_DIR}/react.json"
RESP_DELETE="${WORK_DIR}/delete.json"
RESP_FETCH_AFTER_DELETE="${WORK_DIR}/fetch_after_delete.json"
RESP_UPLOAD_STICKER="${WORK_DIR}/upload_sticker.json"
RESP_SEND_STICKER="${WORK_DIR}/send_sticker.json"
RESP_FETCH_AFTER_STICKER="${WORK_DIR}/fetch_after_sticker.json"
STICKER_FILE="${WORK_DIR}/tiny.png"

cleanup() {
  rm -rf "${WORK_DIR}"
}
trap cleanup EXIT

require_command() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "Missing required command: $1" >&2
    exit 1
  }
}

require_command curl
require_command php

rand_suffix="$(date +%s)_$RANDOM"
USER_A="phaseh_a_${rand_suffix}"
USER_B="phaseh_b_${rand_suffix}"
PASS_A='PhaseH!234'
PASS_B='PhaseH!567'

extract_hidden_csrf() {
  local file="$1"
  php -r '
    $html = file_get_contents($argv[1]);
    if ($html === false) { exit(2); }
    if (preg_match("/name=\"csrf_token\"\s+value=\"([^\"]+)\"/", $html, $m)) {
      echo $m[1];
      exit(0);
    }
    exit(3);
  ' "$file"
}

extract_dashboard_csrf() {
  local file="$1"
  php -r '
    $html = file_get_contents($argv[1]);
    if ($html === false) { exit(2); }
    if (preg_match("/const\s+CSRF_TOKEN\s*=\s*\"([^\"]+)\"/", $html, $m)) {
      echo $m[1];
      exit(0);
    }
    exit(3);
  ' "$file"
}

assert_http_ok() {
  local code="$1"
  local label="$2"
  if [[ "$code" != "200" ]]; then
    echo "[FAIL] ${label}: expected HTTP 200, got ${code}" >&2
    exit 1
  fi
}

assert_http_redirect() {
  local code="$1"
  local label="$2"
  if [[ "$code" != "302" && "$code" != "303" ]]; then
    echo "[FAIL] ${label}: expected redirect 302/303, got ${code}" >&2
    exit 1
  fi
}

login_user() {
  local user="$1"
  local pass="$2"
  local cookie_file="$3"
  local index_file="$4"
  local tag="$5"

  local code
  code=$(curl -sS -o "$index_file" -w "%{http_code}" -c "$cookie_file" -b "$cookie_file" "${BASE_URL}/index.php")
  assert_http_ok "$code" "${tag} fetch index"

  local csrf
  csrf="$(extract_hidden_csrf "$index_file")" || {
    echo "[FAIL] ${tag} csrf token extraction failed" >&2
    exit 1
  }

  code=$(curl -sS -o /dev/null -w "%{http_code}" -c "$cookie_file" -b "$cookie_file" \
    -X POST "${BASE_URL}/api/login.php" \
    --data-urlencode "username=${user}" \
    --data-urlencode "password=${pass}" \
    --data-urlencode "csrf_token=${csrf}")
  assert_http_redirect "$code" "${tag} login"

  echo "[PASS] ${tag} login ok"
}

echo "Running authenticated chat smoke checks against ${BASE_URL}"

login_user "$USER_A" "$PASS_A" "$COOKIE_A" "$INDEX_A" "User A"
login_user "$USER_B" "$PASS_B" "$COOKIE_B" "$INDEX_B" "User B"

code=$(curl -sS -o "$DASH_A" -w "%{http_code}" -c "$COOKIE_A" -b "$COOKIE_A" "${BASE_URL}/dashboard.php")
assert_http_ok "$code" "User A dashboard"
CSRF_A="$(extract_dashboard_csrf "$DASH_A")" || {
  echo "[FAIL] Unable to extract dashboard CSRF token for user A" >&2
  exit 1
}

echo "[PASS] User A dashboard csrf token extracted"

code=$(curl -sS -o "$RESP_SEND" -w "%{http_code}" -c "$COOKIE_A" -b "$COOKIE_A" \
  -X POST "${BASE_URL}/api/send_message.php" \
  -H "X-CSRF-Token: ${CSRF_A}" \
  --data-urlencode "target=${USER_B}" \
  --data-urlencode "message=phase_h_smoke_message" \
  --data-urlencode "message_for_sender=phase_h_smoke_message_sender")
assert_http_ok "$code" "send message"

php -r '
  $json = json_decode(file_get_contents($argv[1]), true);
  if (!is_array($json) || ($json["status"] ?? "") !== "ok" || empty($json["message_id"])) {
    fwrite(STDERR, "[FAIL] send_message response invalid\n");
    exit(1);
  }
  fwrite(STDOUT, "[PASS] send_message response ok\n");
' "$RESP_SEND"

TEXT_MESSAGE_ID="$(php -r '
  $json = json_decode(file_get_contents($argv[1]), true);
  if (!is_array($json) || ($json["status"] ?? "") !== "ok" || empty($json["message_id"])) {
    exit(1);
  }
  echo (int) $json["message_id"];
' "$RESP_SEND")" || {
  echo "[FAIL] Unable to extract text message id" >&2
  exit 1
}

code=$(curl -sS -o "$RESP_FETCH" -w "%{http_code}" -c "$COOKIE_B" -b "$COOKIE_B" \
  "${BASE_URL}/api/fetch_messages.php?with=${USER_A}&limit=20")
assert_http_ok "$code" "fetch messages"

php -r '
  $json = json_decode(file_get_contents($argv[1]), true);
  if (!is_array($json) || ($json["status"] ?? "") !== "ok" || !isset($json["messages"]) || !is_array($json["messages"])) {
    fwrite(STDERR, "[FAIL] fetch_messages response invalid\n");
    exit(1);
  }
  $found = false;
  foreach ($json["messages"] as $m) {
    if (($m["message"] ?? "") === "phase_h_smoke_message") {
      $found = true;
      break;
    }
  }
  if (!$found) {
    fwrite(STDERR, "[FAIL] expected sent message not found in receiver fetch\n");
    exit(1);
  }
  fwrite(STDOUT, "[PASS] receiver fetched sent message\n");
' "$RESP_FETCH"

code=$(curl -sS -o "$RESP_REACT" -w "%{http_code}" -c "$COOKIE_A" -b "$COOKIE_A" \
  -X POST "${BASE_URL}/api/toggle_message_reaction.php" \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: ${CSRF_A}" \
  -d "{\"message_id\":${TEXT_MESSAGE_ID},\"reaction\":\"👍\"}")
assert_http_ok "$code" "toggle reaction"

php -r '
  $json = json_decode(file_get_contents($argv[1]), true);
  if (!is_array($json) || ($json["status"] ?? "") !== "ok" || !isset($json["reactions"])) {
    fwrite(STDERR, "[FAIL] reaction response invalid\n");
    exit(1);
  }
  $found = false;
  foreach ((array) $json["reactions"] as $reaction) {
    if (($reaction["emoji"] ?? "") === "👍" && (int) ($reaction["count"] ?? 0) >= 1) {
      $found = true;
      break;
    }
  }
  if (!$found) {
    fwrite(STDERR, "[FAIL] expected reaction summary not found\n");
    exit(1);
  }
  fwrite(STDOUT, "[PASS] reaction toggle validated\n");
' "$RESP_REACT"

code=$(curl -sS -o "$RESP_DELETE" -w "%{http_code}" -c "$COOKIE_A" -b "$COOKIE_A" \
  -X DELETE "${BASE_URL}/api/delete_messages.php" \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: ${CSRF_A}" \
  -d "{\"messages\":[${TEXT_MESSAGE_ID}],\"delete_for_everyone\":true}")
assert_http_ok "$code" "delete message for everyone"

php -r '
  $json = json_decode(file_get_contents($argv[1]), true);
  if (!is_array($json) || ($json["status"] ?? "") !== "ok") {
    fwrite(STDERR, "[FAIL] delete_messages response invalid\n");
    exit(1);
  }
  if ((int) ($json["messages_deleted"] ?? 0) < 1) {
    fwrite(STDERR, "[FAIL] delete_messages did not delete expected message\n");
    exit(1);
  }
  fwrite(STDOUT, "[PASS] delete message validated\n");
' "$RESP_DELETE"

code=$(curl -sS -o "$RESP_FETCH_AFTER_DELETE" -w "%{http_code}" -c "$COOKIE_B" -b "$COOKIE_B" \
  "${BASE_URL}/api/fetch_messages.php?with=${USER_A}&limit=20")
assert_http_ok "$code" "fetch messages after delete"

php -r '
  $json = json_decode(file_get_contents($argv[1]), true);
  if (!is_array($json) || ($json["status"] ?? "") !== "ok" || !isset($json["messages"]) || !is_array($json["messages"])) {
    fwrite(STDERR, "[FAIL] fetch after delete response invalid\n");
    exit(1);
  }
  foreach ($json["messages"] as $m) {
    if ((int) ($m["id"] ?? 0) === (int) $argv[2]) {
      fwrite(STDERR, "[FAIL] deleted message still present in receiver fetch\n");
      exit(1);
    }
  }
  fwrite(STDOUT, "[PASS] deleted message not present in receiver fetch\n");
' "$RESP_FETCH_AFTER_DELETE" "$TEXT_MESSAGE_ID"

printf '%s' 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO6VYvwAAAAASUVORK5CYII=' | base64 -d > "$STICKER_FILE"

code=$(curl -sS -o "$RESP_UPLOAD_STICKER" -w "%{http_code}" -c "$COOKIE_A" -b "$COOKIE_A" \
  -X POST "${BASE_URL}/api/upload_sticker.php" \
  -H "X-CSRF-Token: ${CSRF_A}" \
  -F "sticker_file=@${STICKER_FILE};type=image/png")
assert_http_ok "$code" "upload sticker"

STICKER_ID="$(php -r '
  $json = json_decode(file_get_contents($argv[1]), true);
  if (!is_array($json) || ($json["status"] ?? "") !== "ok" || !isset($json["sticker"]["id"])) {
    fwrite(STDERR, "[FAIL] upload_sticker response invalid\n");
    exit(1);
  }
  echo (int) $json["sticker"]["id"];
' "$RESP_UPLOAD_STICKER")" || {
  echo "[FAIL] Unable to extract sticker id" >&2
  exit 1
}
echo "[PASS] sticker upload validated"

code=$(curl -sS -o "$RESP_SEND_STICKER" -w "%{http_code}" -c "$COOKIE_A" -b "$COOKIE_A" \
  -X POST "${BASE_URL}/api/send_sticker_message.php" \
  -H "X-CSRF-Token: ${CSRF_A}" \
  --data-urlencode "target=${USER_B}" \
  --data-urlencode "sticker_id=${STICKER_ID}")
assert_http_ok "$code" "send sticker"

STICKER_MESSAGE_ID="$(php -r '
  $json = json_decode(file_get_contents($argv[1]), true);
  if (!is_array($json) || ($json["status"] ?? "") !== "ok" || empty($json["message_id"])) {
    fwrite(STDERR, "[FAIL] send_sticker_message response invalid\n");
    exit(1);
  }
  echo (int) $json["message_id"];
' "$RESP_SEND_STICKER")" || {
  echo "[FAIL] Unable to extract sticker message id" >&2
  exit 1
}

code=$(curl -sS -o "$RESP_FETCH_AFTER_STICKER" -w "%{http_code}" -c "$COOKIE_B" -b "$COOKIE_B" \
  "${BASE_URL}/api/fetch_messages.php?with=${USER_A}&limit=30")
assert_http_ok "$code" "fetch messages after sticker"

php -r '
  $json = json_decode(file_get_contents($argv[1]), true);
  $expectedMessageId = (int) $argv[2];
  $expectedStickerId = (int) $argv[3];
  if (!is_array($json) || ($json["status"] ?? "") !== "ok" || !isset($json["messages"]) || !is_array($json["messages"])) {
    fwrite(STDERR, "[FAIL] fetch after sticker response invalid\n");
    exit(1);
  }
  $found = false;
  foreach ($json["messages"] as $m) {
    if ((int) ($m["id"] ?? 0) === $expectedMessageId
      && ($m["message_type"] ?? "") === "sticker"
      && (int) ($m["sticker_id"] ?? 0) === $expectedStickerId) {
      $found = true;
      break;
    }
  }
  if (!$found) {
    fwrite(STDERR, "[FAIL] receiver fetch missing sent sticker message\n");
    exit(1);
  }
  fwrite(STDOUT, "[PASS] sticker send/fetch validated\n");
' "$RESP_FETCH_AFTER_STICKER" "$STICKER_MESSAGE_ID" "$STICKER_ID"

echo "All authenticated chat smoke checks passed"
