#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-http://localhost:8080}"
WORK_DIR="$(mktemp -d)"
COOKIE_OWNER="${WORK_DIR}/owner.cookies"
COOKIE_MEMBER="${WORK_DIR}/member.cookies"
COOKIE_INTRUDER="${WORK_DIR}/intruder.cookies"
INDEX_OWNER="${WORK_DIR}/owner_index.html"
INDEX_MEMBER="${WORK_DIR}/member_index.html"
INDEX_INTRUDER="${WORK_DIR}/intruder_index.html"
DASH_OWNER="${WORK_DIR}/owner_dash.html"
DASH_MEMBER="${WORK_DIR}/member_dash.html"
RESP_CREATE="${WORK_DIR}/create_group.json"
RESP_JOIN="${WORK_DIR}/join_group.json"
RESP_INTRUDER_FETCH="${WORK_DIR}/intruder_fetch_messages.json"
RESP_INTRUDER_DETAILS="${WORK_DIR}/intruder_fetch_details.json"

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
OWNER="phaseh_owner_${rand_suffix}"
MEMBER="phaseh_member_${rand_suffix}"
INTRUDER="phaseh_intruder_${rand_suffix}"
PASS='PhaseH@1234'
GROUP_TITLE="phase_h_authz_${rand_suffix}"

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

echo "Running group authorization smoke checks against ${BASE_URL}"

login_user "$OWNER" "$PASS" "$COOKIE_OWNER" "$INDEX_OWNER" "Owner"
login_user "$MEMBER" "$PASS" "$COOKIE_MEMBER" "$INDEX_MEMBER" "Member"
login_user "$INTRUDER" "$PASS" "$COOKIE_INTRUDER" "$INDEX_INTRUDER" "Intruder"

code=$(curl -sS -o "$DASH_OWNER" -w "%{http_code}" -c "$COOKIE_OWNER" -b "$COOKIE_OWNER" "${BASE_URL}/dashboard.php")
assert_http "$code" "200" "owner dashboard"
CSRF_OWNER="$(extract_dashboard_csrf "$DASH_OWNER")"

code=$(curl -sS -o "$DASH_MEMBER" -w "%{http_code}" -c "$COOKIE_MEMBER" -b "$COOKIE_MEMBER" "${BASE_URL}/dashboard.php")
assert_http "$code" "200" "member dashboard"
CSRF_MEMBER="$(extract_dashboard_csrf "$DASH_MEMBER")"

code=$(curl -sS -o "$RESP_CREATE" -w "%{http_code}" -c "$COOKIE_OWNER" -b "$COOKIE_OWNER" \
  -X POST "${BASE_URL}/api/groups/create.php" \
  -H "X-CSRF-Token: ${CSRF_OWNER}" \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"${GROUP_TITLE}\",\"description\":\"authz test\"}")
assert_http "$code" "201" "create group"

GROUP_ID="$(php -r '
  $json = json_decode(file_get_contents($argv[1]), true);
  if (!is_array($json) || ($json["status"] ?? "") !== "ok" || !isset($json["group"]["id"])) {
    exit(1);
  }
  echo (int) $json["group"]["id"];
' "$RESP_CREATE")" || {
  echo "[FAIL] create group response invalid" >&2
  exit 1
}

JOIN_TOKEN="$(php -r '
  $json = json_decode(file_get_contents($argv[1]), true);
  if (!is_array($json) || ($json["status"] ?? "") !== "ok" || empty($json["group"]["join_token"])) {
    exit(1);
  }
  echo (string) $json["group"]["join_token"];
' "$RESP_CREATE")" || {
  echo "[FAIL] join token extraction failed" >&2
  exit 1
}

code=$(curl -sS -o "$RESP_JOIN" -w "%{http_code}" -c "$COOKIE_MEMBER" -b "$COOKIE_MEMBER" \
  -X POST "${BASE_URL}/api/groups/join.php" \
  -H "X-CSRF-Token: ${CSRF_MEMBER}" \
  -H "Content-Type: application/json" \
  -d "{\"token\":\"${JOIN_TOKEN}\"}")
assert_http "$code" "200" "member join"

code=$(curl -sS -o "$RESP_INTRUDER_FETCH" -w "%{http_code}" -c "$COOKIE_INTRUDER" -b "$COOKIE_INTRUDER" \
  "${BASE_URL}/api/messages/fetch.php?group_id=${GROUP_ID}&limit=20")
assert_http "$code" "403" "intruder fetch group messages forbidden"

code=$(curl -sS -o "$RESP_INTRUDER_DETAILS" -w "%{http_code}" -c "$COOKIE_INTRUDER" -b "$COOKIE_INTRUDER" \
  "${BASE_URL}/api/groups/fetch_details.php?group_id=${GROUP_ID}")
assert_http "$code" "403" "intruder fetch group details forbidden"

echo "All group authorization smoke checks passed"
