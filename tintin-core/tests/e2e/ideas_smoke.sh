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
RESP_CREATE="${WORK_DIR}/create.json"
RESP_FETCH="${WORK_DIR}/fetch.json"
RESP_VOTE="${WORK_DIR}/vote.json"
RESP_DELETE="${WORK_DIR}/delete.json"
RESP_DELETE_DENIED="${WORK_DIR}/delete_denied.json"

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
USER_A="ideas_a_${rand_suffix}"
USER_B="ideas_b_${rand_suffix}"
PASS='Ideas!234'

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

echo "Running ideas/feedback smoke checks against ${BASE_URL}"

login_user "$USER_A" "$PASS" "$COOKIE_A" "$INDEX_A" "User A"
login_user "$USER_B" "$PASS" "$COOKIE_B" "$INDEX_B" "User B"

code=$(curl -sS -o "$DASH_A" -w "%{http_code}" -c "$COOKIE_A" -b "$COOKIE_A" "${BASE_URL}/dashboard.php")
assert_http "$code" "200" "User A dashboard"
CSRF_A="$(extract_dashboard_csrf "$DASH_A")"

code=$(curl -sS -o "$DASH_B" -w "%{http_code}" -c "$COOKIE_B" -b "$COOKIE_B" "${BASE_URL}/dashboard.php")
assert_http "$code" "200" "User B dashboard"
CSRF_B="$(extract_dashboard_csrf "$DASH_B")"

# Create an idea
IDEA_BODY="Test idea from smoke test ${rand_suffix}"
code=$(curl -sS -o "$RESP_CREATE" -w "%{http_code}" -c "$COOKIE_A" -b "$COOKIE_A" \
  -X POST "${BASE_URL}/api/ideas/create.php" \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: ${CSRF_A}" \
  -d "{\"body\":\"${IDEA_BODY}\"}")
if [[ "$code" != "200" && "$code" != "201" ]]; then
  echo "[FAIL] create idea: expected HTTP 200/201, got ${code}" >&2
  exit 1
fi

IDEA_ID="$(php -r '
  $json = json_decode(file_get_contents($argv[1]), true);
  if (!is_array($json) || ($json["status"] ?? "") !== "ok" || empty($json["idea_id"])) {
    fwrite(STDERR, "[FAIL] create idea response invalid\n");
    exit(1);
  }
  echo (int) $json["idea_id"];
' "$RESP_CREATE")" || {
  echo "[FAIL] Unable to extract idea id" >&2
  exit 1
}

echo "[PASS] idea created (id: ${IDEA_ID})"

# Fetch ideas — should include our new idea
code=$(curl -sS -o "$RESP_FETCH" -w "%{http_code}" -c "$COOKIE_B" -b "$COOKIE_B" \
  "${BASE_URL}/api/ideas/fetch.php")
assert_http "$code" "200" "fetch ideas"

php -r '
  $json = json_decode(file_get_contents($argv[1]), true);
  $ideaId = (int) $argv[2];
  if (!is_array($json) || ($json["status"] ?? "") !== "ok" || !is_array($json["ideas"] ?? null)) {
    fwrite(STDERR, "[FAIL] fetch ideas response invalid\n");
    exit(1);
  }
  $found = false;
  foreach ($json["ideas"] as $idea) {
    if ((int) ($idea["id"] ?? 0) === $ideaId) {
      $found = true;
      break;
    }
  }
  if (!$found) {
    fwrite(STDERR, "[FAIL] created idea not found in fetch\n");
    exit(1);
  }
  fwrite(STDOUT, "[PASS] idea visible in fetch\n");
' "$RESP_FETCH" "$IDEA_ID"

# Vote on the idea (User B upvotes)
code=$(curl -sS -o "$RESP_VOTE" -w "%{http_code}" -c "$COOKIE_B" -b "$COOKIE_B" \
  -X POST "${BASE_URL}/api/ideas/vote.php" \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: ${CSRF_B}" \
  -d "{\"idea_id\":${IDEA_ID},\"vote\":1}")
assert_http "$code" "200" "vote on idea"

php -r '
  $json = json_decode(file_get_contents($argv[1]), true);
  if (!is_array($json) || ($json["status"] ?? "") !== "ok") {
    fwrite(STDERR, "[FAIL] vote response invalid\n");
    exit(1);
  }
  fwrite(STDOUT, "[PASS] vote validated\n");
' "$RESP_VOTE"

# User B should NOT be able to delete User A's idea
code=$(curl -sS -o "$RESP_DELETE_DENIED" -w "%{http_code}" -c "$COOKIE_B" -b "$COOKIE_B" \
  -X POST "${BASE_URL}/api/ideas/delete.php" \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: ${CSRF_B}" \
  -d "{\"idea_id\":${IDEA_ID}}")

if [[ "$code" == "200" ]]; then
  echo "[FAIL] User B should NOT be able to delete User A's idea" >&2
  exit 1
fi

echo "[PASS] non-owner delete correctly rejected (HTTP ${code})"

# Owner deletes their own idea
code=$(curl -sS -o "$RESP_DELETE" -w "%{http_code}" -c "$COOKIE_A" -b "$COOKIE_A" \
  -X POST "${BASE_URL}/api/ideas/delete.php" \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: ${CSRF_A}" \
  -d "{\"idea_id\":${IDEA_ID}}")
assert_http "$code" "200" "owner delete idea"

php -r '
  $json = json_decode(file_get_contents($argv[1]), true);
  if (!is_array($json) || ($json["status"] ?? "") !== "ok") {
    fwrite(STDERR, "[FAIL] delete response invalid\n");
    exit(1);
  }
  fwrite(STDOUT, "[PASS] owner delete validated\n");
' "$RESP_DELETE"

echo "All ideas smoke checks passed"
