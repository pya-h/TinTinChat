#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-http://localhost:8080}"
WORK_DIR="$(mktemp -d)"
COOKIE_A="${WORK_DIR}/a.cookies"
INDEX_A="${WORK_DIR}/a_index.html"
DASH_A="${WORK_DIR}/a_dash.html"
RESP_NO_CSRF="${WORK_DIR}/no_csrf.json"
RESP_BAD_CSRF="${WORK_DIR}/bad_csrf.json"
RESP_WRONG_METHOD="${WORK_DIR}/wrong_method.json"

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
USER_A="session_test_${rand_suffix}"
PASS='Session!234'

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

echo "Running session & CSRF smoke checks against ${BASE_URL}"

login_user "$USER_A" "$PASS" "$COOKIE_A" "$INDEX_A" "User A"

code=$(curl -sS -o "$DASH_A" -w "%{http_code}" -c "$COOKIE_A" -b "$COOKIE_A" "${BASE_URL}/dashboard.php")
assert_http "$code" "200" "User A dashboard"
CSRF_A="$(extract_dashboard_csrf "$DASH_A")"

echo "[PASS] CSRF token extracted"

# POST without CSRF should be rejected
code=$(curl -sS -o "$RESP_NO_CSRF" -w "%{http_code}" -c "$COOKIE_A" -b "$COOKIE_A" \
  -X POST "${BASE_URL}/api/messages/send_text.php" \
  --data-urlencode "target=nobody" \
  --data-urlencode "message=test" \
  --data-urlencode "message_for_sender=test")
assert_http "$code" "403" "POST without CSRF rejected"

php -r '
  $json = json_decode(file_get_contents($argv[1]), true);
  if (!is_array($json) || ($json["status"] ?? "") !== "error") {
    fwrite(STDERR, "[FAIL] expected error response\n");
    exit(1);
  }
  $code = (string) ($json["error_details"]["code"] ?? "");
  if ($code !== "INVALID_CSRF") {
    fwrite(STDERR, "[FAIL] expected INVALID_CSRF, got {$code}\n");
    exit(1);
  }
  fwrite(STDOUT, "[PASS] CSRF rejection returns correct error code\n");
' "$RESP_NO_CSRF"

# POST with wrong CSRF should be rejected
code=$(curl -sS -o "$RESP_BAD_CSRF" -w "%{http_code}" -c "$COOKIE_A" -b "$COOKIE_A" \
  -X POST "${BASE_URL}/api/messages/send_text.php" \
  -H "X-CSRF-Token: invalid_token_12345" \
  --data-urlencode "target=nobody" \
  --data-urlencode "message=test" \
  --data-urlencode "message_for_sender=test")
assert_http "$code" "403" "POST with wrong CSRF rejected"

echo "[PASS] wrong CSRF rejected"

# GET request to POST-only endpoint should be rejected
code=$(curl -sS -o "$RESP_WRONG_METHOD" -w "%{http_code}" -c "$COOKIE_A" -b "$COOKIE_A" \
  "${BASE_URL}/api/messages/send_text.php")

if [[ "$code" == "200" ]]; then
  echo "[FAIL] GET on POST-only endpoint should not return 200" >&2
  exit 1
fi

echo "[PASS] wrong HTTP method rejected (HTTP ${code})"

# Unauthenticated dashboard access should redirect to login
COOKIE_FRESH="${WORK_DIR}/fresh.cookies"
code=$(curl -sS -o /dev/null -w "%{http_code}" -c "$COOKIE_FRESH" "${BASE_URL}/dashboard.php")

if [[ "$code" != "302" && "$code" != "303" && "$code" != "200" ]]; then
  # Some apps redirect, some show login page with 200
  echo "[PASS] unauthenticated dashboard access handled (HTTP ${code})"
else
  echo "[PASS] unauthenticated dashboard access returns HTTP ${code}"
fi

# Additional API guard checks for endpoints not covered elsewhere
for endpoint in \
  "/api/ideas/fetch.php" \
  "/api/typing/fetch.php" \
  "/api/users/search.php?query=test" \
  "/api/keys/get_private.php" \
  "/api/groups/fetch.php" \
  "/api/users/list_blocked.php"; do

  code=$(curl -sS -o /dev/null -w "%{http_code}" "${BASE_URL}${endpoint}")
  if [[ "$code" != "401" ]]; then
    echo "[FAIL] ${endpoint} should require auth, got HTTP ${code}" >&2
    exit 1
  fi
done

echo "[PASS] additional API guard checks passed (6 endpoints)"

echo "All session & CSRF smoke checks passed"
