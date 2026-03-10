#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-http://localhost:8080}"
WORK_DIR="$(mktemp -d)"
COOKIE_A="${WORK_DIR}/a.cookies"
COOKIE_B="${WORK_DIR}/b.cookies"
INDEX_A="${WORK_DIR}/a_index.html"
INDEX_B="${WORK_DIR}/b_index.html"
DASH_A="${WORK_DIR}/a_dash.html"
DASH_B="${WORK_DIR}/b_dash.html"
RESP_BLOCK="${WORK_DIR}/block.json"
RESP_SEND_BLOCKED="${WORK_DIR}/send_blocked.json"
RESP_UNBLOCK="${WORK_DIR}/unblock.json"
RESP_SEND_ALLOWED="${WORK_DIR}/send_allowed.json"

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
USER_A="phasei_block_a_${rand_suffix}"
USER_B="phasei_block_b_${rand_suffix}"
PASS='PhaseI@1234'

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

echo "Running block-user smoke checks against ${BASE_URL}"

login_user "$USER_A" "$PASS" "$COOKIE_A" "$INDEX_A" "User A"
login_user "$USER_B" "$PASS" "$COOKIE_B" "$INDEX_B" "User B"

code=$(curl -sS -o "$DASH_A" -w "%{http_code}" -c "$COOKIE_A" -b "$COOKIE_A" "${BASE_URL}/dashboard.php")
assert_http "$code" "200" "User A dashboard"
CSRF_A="$(extract_dashboard_csrf "$DASH_A")"

code=$(curl -sS -o "$DASH_B" -w "%{http_code}" -c "$COOKIE_B" -b "$COOKIE_B" "${BASE_URL}/dashboard.php")
assert_http "$code" "200" "User B dashboard"
CSRF_B="$(extract_dashboard_csrf "$DASH_B")"

code=$(curl -sS -o "$RESP_BLOCK" -w "%{http_code}" -c "$COOKIE_A" -b "$COOKIE_A" \
  -X POST "${BASE_URL}/api/users/block.php" \
  -H "X-CSRF-Token: ${CSRF_A}" \
  -H "Content-Type: application/json" \
  -d "{\"target_username\":\"${USER_B}\"}")
assert_http "$code" "200" "block user"

code=$(curl -sS -o "$RESP_SEND_BLOCKED" -w "%{http_code}" -c "$COOKIE_B" -b "$COOKIE_B" \
  -X POST "${BASE_URL}/api/messages/send_text.php" \
  -H "X-CSRF-Token: ${CSRF_B}" \
  --data-urlencode "target=${USER_A}" \
  --data-urlencode "message=blocked_message" \
  --data-urlencode "message_for_sender=blocked_message")
assert_http "$code" "403" "blocked sender denied"

code=$(curl -sS -o "$RESP_UNBLOCK" -w "%{http_code}" -c "$COOKIE_A" -b "$COOKIE_A" \
  -X POST "${BASE_URL}/api/users/unblock.php" \
  -H "X-CSRF-Token: ${CSRF_A}" \
  -H "Content-Type: application/json" \
  -d "{\"target_username\":\"${USER_B}\"}")
assert_http "$code" "200" "unblock user"

code=$(curl -sS -o "$RESP_SEND_ALLOWED" -w "%{http_code}" -c "$COOKIE_B" -b "$COOKIE_B" \
  -X POST "${BASE_URL}/api/messages/send_text.php" \
  -H "X-CSRF-Token: ${CSRF_B}" \
  --data-urlencode "target=${USER_A}" \
  --data-urlencode "message=allowed_after_unblock" \
  --data-urlencode "message_for_sender=allowed_after_unblock")
assert_http "$code" "200" "sender allowed after unblock"

echo "All block-user smoke checks passed"
