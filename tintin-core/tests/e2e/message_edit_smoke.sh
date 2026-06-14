#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-http://localhost:8080}"
WORK_DIR="$(mktemp -d)"
COOKIE_A="${WORK_DIR}/a.cookies"
COOKIE_B="${WORK_DIR}/b.cookies"
INDEX_A="${WORK_DIR}/a_index.html"
INDEX_B="${WORK_DIR}/b_index.html"
DASH_A="${WORK_DIR}/a_dash.html"
RESP_SEND="${WORK_DIR}/send.json"
RESP_EDIT="${WORK_DIR}/edit.json"
RESP_FETCH="${WORK_DIR}/fetch.json"
RESP_EDIT_WRONG_USER="${WORK_DIR}/edit_wrong_user.json"

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
USER_A="edit_a_${rand_suffix}"
USER_B="edit_b_${rand_suffix}"
PASS='EditTest!234'

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

assert_http() {
  local actual="$1"
  local expected="$2"
  local label="$3"
  if [[ "$actual" != "$expected" ]]; then
    echo "[FAIL] ${label}: expected HTTP ${expected}, got ${actual}" >&2
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
  assert_http "$code" "200" "${tag} fetch index"

  local csrf
  csrf="$(extract_hidden_csrf "$index_file")" || {
    echo "[FAIL] ${tag} csrf extraction failed" >&2
    exit 1
  }

  code=$(curl -sS -o /dev/null -w "%{http_code}" -c "$cookie_file" -b "$cookie_file" \
    -X POST "${BASE_URL}/api/auth/login.php" \
    --data-urlencode "username=${user}" \
    --data-urlencode "password=${pass}" \
    --data-urlencode "csrf_token=${csrf}")

  if [[ "$code" != "302" && "$code" != "303" ]]; then
    echo "[FAIL] ${tag} login expected redirect, got ${code}" >&2
    exit 1
  fi

  echo "[PASS] ${tag} login"
}

echo "Running message edit smoke checks against ${BASE_URL}"

login_user "$USER_A" "$PASS" "$COOKIE_A" "$INDEX_A" "User A"
login_user "$USER_B" "$PASS" "$COOKIE_B" "$INDEX_B" "User B"

# Get CSRF for both users
code=$(curl -sS -o "$DASH_A" -w "%{http_code}" -c "$COOKIE_A" -b "$COOKIE_A" "${BASE_URL}/dashboard.php")
assert_http "$code" "200" "User A dashboard"
CSRF_A="$(extract_dashboard_csrf "$DASH_A")"

DASH_B="${WORK_DIR}/b_dash.html"
code=$(curl -sS -o "$DASH_B" -w "%{http_code}" -c "$COOKIE_B" -b "$COOKIE_B" "${BASE_URL}/dashboard.php")
assert_http "$code" "200" "User B dashboard"
CSRF_B="$(extract_dashboard_csrf "$DASH_B")"

# Send a message from A to B
code=$(curl -sS -o "$RESP_SEND" -w "%{http_code}" -c "$COOKIE_A" -b "$COOKIE_A" \
  -X POST "${BASE_URL}/api/messages/send_text.php" \
  -H "X-CSRF-Token: ${CSRF_A}" \
  --data-urlencode "target=${USER_B}" \
  --data-urlencode "message=original_text" \
  --data-urlencode "message_for_sender=original_text_sender")
assert_http "$code" "200" "send message"

MESSAGE_ID="$(php -r '
  $json = json_decode(file_get_contents($argv[1]), true);
  if (!is_array($json) || ($json["status"] ?? "") !== "ok" || empty($json["message_id"])) {
    exit(1);
  }
  echo (int) $json["message_id"];
' "$RESP_SEND")" || {
  echo "[FAIL] Unable to extract message id" >&2
  exit 1
}

echo "[PASS] message sent (id: ${MESSAGE_ID})"

# Edit the message (should succeed - owner within time window)
code=$(curl -sS -o "$RESP_EDIT" -w "%{http_code}" -c "$COOKIE_A" -b "$COOKIE_A" \
  -X POST "${BASE_URL}/api/messages/edit.php" \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: ${CSRF_A}" \
  -d "{\"message_id\":${MESSAGE_ID},\"message\":\"edited_text\",\"message_for_sender\":\"edited_text_sender\"}")
assert_http "$code" "200" "edit message"

php -r '
  $json = json_decode(file_get_contents($argv[1]), true);
  if (!is_array($json) || ($json["status"] ?? "") !== "ok") {
    fwrite(STDERR, "[FAIL] edit response invalid\n");
    exit(1);
  }
  if (empty($json["edited_at"])) {
    fwrite(STDERR, "[FAIL] edit response missing edited_at\n");
    exit(1);
  }
  fwrite(STDOUT, "[PASS] message edit validated\n");
' "$RESP_EDIT"

# Fetch and verify the edit is visible
code=$(curl -sS -o "$RESP_FETCH" -w "%{http_code}" -c "$COOKIE_B" -b "$COOKIE_B" \
  "${BASE_URL}/api/messages/fetch.php?with=${USER_A}&limit=20")
assert_http "$code" "200" "fetch after edit"

php -r '
  $json = json_decode(file_get_contents($argv[1]), true);
  $msgId = (int) $argv[2];
  if (!is_array($json) || ($json["status"] ?? "") !== "ok") {
    fwrite(STDERR, "[FAIL] fetch response invalid\n");
    exit(1);
  }
  $found = false;
  foreach ($json["messages"] as $m) {
    if ((int) ($m["id"] ?? 0) === $msgId) {
      if (($m["message"] ?? "") !== "edited_text") {
        fwrite(STDERR, "[FAIL] message content not updated\n");
        exit(1);
      }
      if (empty($m["edited_at"])) {
        fwrite(STDERR, "[FAIL] edited_at not present on fetched message\n");
        exit(1);
      }
      $found = true;
      break;
    }
  }
  if (!$found) {
    fwrite(STDERR, "[FAIL] edited message not found in fetch\n");
    exit(1);
  }
  fwrite(STDOUT, "[PASS] edited content verified in fetch\n");
' "$RESP_FETCH" "$MESSAGE_ID"

# User B should NOT be able to edit User A's message
code=$(curl -sS -o "$RESP_EDIT_WRONG_USER" -w "%{http_code}" -c "$COOKIE_B" -b "$COOKIE_B" \
  -X POST "${BASE_URL}/api/messages/edit.php" \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: ${CSRF_B}" \
  -d "{\"message_id\":${MESSAGE_ID},\"message\":\"hacked\",\"message_for_sender\":\"hacked\"}")

if [[ "$code" == "200" ]]; then
  echo "[FAIL] User B should NOT be able to edit User A's message" >&2
  exit 1
fi

echo "[PASS] non-owner edit correctly rejected (HTTP ${code})"

echo "All message edit smoke checks passed"
