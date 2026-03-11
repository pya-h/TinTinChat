#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-http://localhost:8080}"
WORK_DIR="$(mktemp -d)"
COOKIE_FILE="${WORK_DIR}/user.cookies"
COOKIE_RELOGIN="${WORK_DIR}/user_relogin.cookies"
INDEX_FILE="${WORK_DIR}/index.html"
DASH_FILE="${WORK_DIR}/dashboard.html"
RESP_USERNAME_UPDATE="${WORK_DIR}/username_update.json"
RESP_PASSWORD_UPDATE="${WORK_DIR}/password_update.json"

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

rand_suffix="$(date +%s)_$RANDOM"
INITIAL_USERNAME="phasek_profile_${rand_suffix}"
UPDATED_USERNAME="${INITIAL_USERNAME}_new"
INITIAL_PASSWORD='PhaseK!234'
UPDATED_PASSWORD='PhaseK!567'

echo "Running profile settings smoke checks against ${BASE_URL}"

code=$(curl -sS -o "$INDEX_FILE" -w "%{http_code}" -c "$COOKIE_FILE" -b "$COOKIE_FILE" "${BASE_URL}/index.php")
assert_http_ok "$code" "fetch index"

LOGIN_CSRF="$(extract_hidden_csrf "$INDEX_FILE")" || {
  echo "[FAIL] Unable to extract login CSRF token" >&2
  exit 1
}

code=$(curl -sS -o /dev/null -w "%{http_code}" -c "$COOKIE_FILE" -b "$COOKIE_FILE" \
  -X POST "${BASE_URL}/api/auth/login.php" \
  --data-urlencode "username=${INITIAL_USERNAME}" \
  --data-urlencode "password=${INITIAL_PASSWORD}" \
  --data-urlencode "csrf_token=${LOGIN_CSRF}")
assert_http_redirect "$code" "initial login"

echo "[PASS] Initial login ok"

code=$(curl -sS -o "$DASH_FILE" -w "%{http_code}" -c "$COOKIE_FILE" -b "$COOKIE_FILE" "${BASE_URL}/dashboard.php")
assert_http_ok "$code" "fetch dashboard"

API_CSRF="$(extract_dashboard_csrf "$DASH_FILE")" || {
  echo "[FAIL] Unable to extract dashboard CSRF token" >&2
  exit 1
}

code=$(curl -sS -o "$RESP_USERNAME_UPDATE" -w "%{http_code}" -c "$COOKIE_FILE" -b "$COOKIE_FILE" \
  -X POST "${BASE_URL}/api/users/update_profile.php" \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: ${API_CSRF}" \
  -d "{\"action\":\"username\",\"username\":\"${UPDATED_USERNAME}\"}")
assert_http_ok "$code" "update username"

php -r '
  $json = json_decode(file_get_contents($argv[1]), true);
  $expected = (string) $argv[2];
  if (!is_array($json) || ($json["status"] ?? "") !== "ok") {
    fwrite(STDERR, "[FAIL] update username response invalid\n");
    exit(1);
  }
  if ((string) ($json["username"] ?? "") !== $expected) {
    fwrite(STDERR, "[FAIL] update username did not return expected username\n");
    exit(1);
  }
  fwrite(STDOUT, "[PASS] Username update validated\n");
' "$RESP_USERNAME_UPDATE" "$UPDATED_USERNAME"

code=$(curl -sS -o "$RESP_PASSWORD_UPDATE" -w "%{http_code}" -c "$COOKIE_FILE" -b "$COOKIE_FILE" \
  -X POST "${BASE_URL}/api/users/update_profile.php" \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: ${API_CSRF}" \
  -d "{\"action\":\"password\",\"current_password\":\"${INITIAL_PASSWORD}\",\"new_password\":\"${UPDATED_PASSWORD}\",\"confirm_password\":\"${UPDATED_PASSWORD}\"}")
assert_http_ok "$code" "update password"

php -r '
  $json = json_decode(file_get_contents($argv[1]), true);
  if (!is_array($json) || ($json["status"] ?? "") !== "ok") {
    fwrite(STDERR, "[FAIL] update password response invalid\n");
    exit(1);
  }
  fwrite(STDOUT, "[PASS] Password update validated\n");
' "$RESP_PASSWORD_UPDATE"

code=$(curl -sS -o "$INDEX_FILE" -w "%{http_code}" -c "$COOKIE_RELOGIN" -b "$COOKIE_RELOGIN" "${BASE_URL}/index.php")
assert_http_ok "$code" "fetch index for re-login"
LOGIN_CSRF="$(extract_hidden_csrf "$INDEX_FILE")" || {
  echo "[FAIL] Unable to extract login CSRF token for re-login" >&2
  exit 1
}

code=$(curl -sS -o /dev/null -w "%{http_code}" -c "$COOKIE_RELOGIN" -b "$COOKIE_RELOGIN" \
  -X POST "${BASE_URL}/api/auth/login.php" \
  --data-urlencode "username=${UPDATED_USERNAME}" \
  --data-urlencode "password=${UPDATED_PASSWORD}" \
  --data-urlencode "csrf_token=${LOGIN_CSRF}")
assert_http_redirect "$code" "re-login with updated credentials"

echo "[PASS] Re-login with updated credentials validated"
echo "All profile settings smoke checks passed"
