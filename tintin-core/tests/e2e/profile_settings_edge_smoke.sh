#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-http://localhost:8080}"
WORK_DIR="$(mktemp -d)"
COOKIE_A="${WORK_DIR}/a.cookies"
COOKIE_B="${WORK_DIR}/b.cookies"
INDEX_A="${WORK_DIR}/a_index.html"
INDEX_B="${WORK_DIR}/b_index.html"
DASH_A="${WORK_DIR}/a_dashboard.html"
RESP_TAKEN_USERNAME="${WORK_DIR}/taken_username.json"
RESP_WEAK_PASSWORD="${WORK_DIR}/weak_password.json"
RESP_CONFIRM_MISMATCH="${WORK_DIR}/confirm_mismatch.json"
RESP_WRONG_CURRENT="${WORK_DIR}/wrong_current_password.json"
RESP_MISSING_CSRF="${WORK_DIR}/missing_csrf.json"
RESP_INVALID_JSON="${WORK_DIR}/invalid_json.json"

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

assert_http() {
  local actual="$1"
  local expected="$2"
  local label="$3"
  if [[ "$actual" != "$expected" ]]; then
    echo "[FAIL] ${label}: expected HTTP ${expected}, got ${actual}" >&2
    exit 1
  fi
}

assert_error_code() {
  local file="$1"
  local expected_code="$2"
  local label="$3"

  php -r '
    $json = json_decode(file_get_contents($argv[1]), true);
    $expected = (string) $argv[2];
    $label = (string) $argv[3];
    if (!is_array($json)) {
      fwrite(STDERR, "[FAIL] {$label}: invalid JSON\n");
      exit(1);
    }
    if (($json["status"] ?? "") !== "error") {
      fwrite(STDERR, "[FAIL] {$label}: expected error status\n");
      exit(1);
    }
    $actual = (string) (($json["error_details"]["code"] ?? ""));
    if ($actual !== $expected) {
      fwrite(STDERR, "[FAIL] {$label}: expected {$expected}, got {$actual}\n");
      exit(1);
    }
    fwrite(STDOUT, "[PASS] {$label}\n");
  ' "$file" "$expected_code" "$label"
}

login_user() {
  local username="$1"
  local password="$2"
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
    --data-urlencode "username=${username}" \
    --data-urlencode "password=${password}" \
    --data-urlencode "csrf_token=${csrf}")

  if [[ "$code" != "302" && "$code" != "303" ]]; then
    echo "[FAIL] ${tag} login expected redirect, got ${code}" >&2
    exit 1
  fi

  echo "[PASS] ${tag} login"
}

echo "Running profile settings edge-case smoke checks against ${BASE_URL}"

rand_suffix="$(date +%s)_$RANDOM"
USER_A="phasek_edge_a_${rand_suffix}"
USER_B="phasek_edge_b_${rand_suffix}"
PASS_A='PhaseK!234'
PASS_B='PhaseK!345'

login_user "$USER_A" "$PASS_A" "$COOKIE_A" "$INDEX_A" "User A"
login_user "$USER_B" "$PASS_B" "$COOKIE_B" "$INDEX_B" "User B"

code=$(curl -sS -o "$DASH_A" -w "%{http_code}" -c "$COOKIE_A" -b "$COOKIE_A" "${BASE_URL}/dashboard.php")
assert_http "$code" "200" "User A dashboard"
CSRF_A="$(extract_dashboard_csrf "$DASH_A")"

code=$(curl -sS -o "$RESP_TAKEN_USERNAME" -w "%{http_code}" -c "$COOKIE_A" -b "$COOKIE_A" \
  -X POST "${BASE_URL}/api/users/update_profile.php" \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: ${CSRF_A}" \
  -d "{\"action\":\"username\",\"username\":\"${USER_B}\"}")
assert_http "$code" "409" "reject taken username"
assert_error_code "$RESP_TAKEN_USERNAME" "USERNAME_TAKEN" "taken username code"

code=$(curl -sS -o "$RESP_WEAK_PASSWORD" -w "%{http_code}" -c "$COOKIE_A" -b "$COOKIE_A" \
  -X POST "${BASE_URL}/api/users/update_profile.php" \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: ${CSRF_A}" \
  -d "{\"action\":\"password\",\"current_password\":\"${PASS_A}\",\"new_password\":\"weak\",\"confirm_password\":\"weak\"}")
assert_http "$code" "400" "reject weak password"
assert_error_code "$RESP_WEAK_PASSWORD" "INVALID_PASSWORD" "weak password code"

code=$(curl -sS -o "$RESP_CONFIRM_MISMATCH" -w "%{http_code}" -c "$COOKIE_A" -b "$COOKIE_A" \
  -X POST "${BASE_URL}/api/users/update_profile.php" \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: ${CSRF_A}" \
  -d "{\"action\":\"password\",\"current_password\":\"${PASS_A}\",\"new_password\":\"PhaseK!567\",\"confirm_password\":\"PhaseK!568\"}")
assert_http "$code" "400" "reject password confirm mismatch"
assert_error_code "$RESP_CONFIRM_MISMATCH" "PASSWORD_CONFIRM_MISMATCH" "password confirm mismatch code"

code=$(curl -sS -o "$RESP_WRONG_CURRENT" -w "%{http_code}" -c "$COOKIE_A" -b "$COOKIE_A" \
  -X POST "${BASE_URL}/api/users/update_profile.php" \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: ${CSRF_A}" \
  -d "{\"action\":\"password\",\"current_password\":\"WrongPass!1\",\"new_password\":\"PhaseK!890\",\"confirm_password\":\"PhaseK!890\"}")
assert_http "$code" "403" "reject wrong current password"
assert_error_code "$RESP_WRONG_CURRENT" "INVALID_CURRENT_PASSWORD" "wrong current password code"

code=$(curl -sS -o "$RESP_MISSING_CSRF" -w "%{http_code}" -c "$COOKIE_A" -b "$COOKIE_A" \
  -X POST "${BASE_URL}/api/users/update_profile.php" \
  -H "Content-Type: application/json" \
  -d "{\"action\":\"username\",\"username\":\"${USER_A}_x\"}")
assert_http "$code" "403" "reject missing csrf"
assert_error_code "$RESP_MISSING_CSRF" "INVALID_CSRF" "missing csrf code"

code=$(curl -sS -o "$RESP_INVALID_JSON" -w "%{http_code}" -c "$COOKIE_A" -b "$COOKIE_A" \
  -X POST "${BASE_URL}/api/users/update_profile.php" \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: ${CSRF_A}" \
  --data-binary '{"action":"username",')
assert_http "$code" "400" "reject invalid json"
assert_error_code "$RESP_INVALID_JSON" "INVALID_JSON" "invalid json code"

echo "All profile settings edge-case smoke checks passed"
