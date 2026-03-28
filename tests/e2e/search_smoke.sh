#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-http://localhost:8080}"
WORK_DIR="$(mktemp -d)"
COOKIE_A="${WORK_DIR}/a.cookies"
COOKIE_B="${WORK_DIR}/b.cookies"
INDEX_A="${WORK_DIR}/a_index.html"
INDEX_B="${WORK_DIR}/b_index.html"
RESP_SEARCH="${WORK_DIR}/search.json"
RESP_SEARCH_SHORT="${WORK_DIR}/search_short.json"
RESP_SEARCH_EMPTY="${WORK_DIR}/search_empty.json"
RESP_SEARCH_NOAUTH="${WORK_DIR}/search_noauth.json"

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
USER_A="srchone_${rand_suffix}"
USER_B="srchtwo_${rand_suffix}"
PASS='Search!234'

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

echo "Running search smoke checks against ${BASE_URL}"

# Register both users (login auto-registers)
login_user "$USER_A" "$PASS" "$COOKIE_A" "$INDEX_A" "User A"
login_user "$USER_B" "$PASS" "$COOKIE_B" "$INDEX_B" "User B"

# User A searches for User B (search excludes self, returns string array)
code=$(curl -sS -o "$RESP_SEARCH" -w "%{http_code}" -c "$COOKIE_A" -b "$COOKIE_A" \
  "${BASE_URL}/api/users/search.php?query=srchtwo_${rand_suffix}")
assert_http "$code" "200" "search by username"

php -r '
  $json = json_decode(file_get_contents($argv[1]), true);
  $target = $argv[2];
  if (!is_array($json) || ($json["status"] ?? "") !== "ok") {
    fwrite(STDERR, "[FAIL] search response invalid\n");
    exit(1);
  }
  if (!is_array($json["users"] ?? null)) {
    fwrite(STDERR, "[FAIL] search response missing users array\n");
    exit(1);
  }
  // users may be array of strings or array of objects
  $found = false;
  foreach ($json["users"] as $u) {
    $name = is_string($u) ? $u : ($u["username"] ?? "");
    if ($name === $target) {
      $found = true;
      break;
    }
  }
  if (!$found) {
    fwrite(STDERR, "[FAIL] search did not find target user\n");
    exit(1);
  }
  fwrite(STDOUT, "[PASS] search found target user\n");
' "$RESP_SEARCH" "$USER_B"

# Search with too-short query (should return empty or error)
code=$(curl -sS -o "$RESP_SEARCH_SHORT" -w "%{http_code}" -c "$COOKIE_A" -b "$COOKIE_A" \
  "${BASE_URL}/api/users/search.php?query=ab")

if [[ "$code" == "200" ]]; then
  php -r '
    $json = json_decode(file_get_contents($argv[1]), true);
    if (is_array($json) && ($json["status"] ?? "") === "ok") {
      $users = $json["users"] ?? [];
      if (count($users) === 0) {
        fwrite(STDOUT, "[PASS] too-short query returns empty results\n");
        exit(0);
      }
    }
    if (is_array($json) && ($json["status"] ?? "") === "error") {
      fwrite(STDOUT, "[PASS] too-short query rejected in response body\n");
      exit(0);
    }
    fwrite(STDERR, "[FAIL] too-short query should return empty or error\n");
    exit(1);
  ' "$RESP_SEARCH_SHORT"
else
  echo "[PASS] too-short query rejected (HTTP ${code})"
fi

# Search with nonsense query (should return empty results)
code=$(curl -sS -o "$RESP_SEARCH_EMPTY" -w "%{http_code}" -c "$COOKIE_A" -b "$COOKIE_A" \
  "${BASE_URL}/api/users/search.php?query=zzz_nonexistent_${rand_suffix}")
assert_http "$code" "200" "search nonsense"

php -r '
  $json = json_decode(file_get_contents($argv[1]), true);
  if (!is_array($json) || ($json["status"] ?? "") !== "ok") {
    fwrite(STDERR, "[FAIL] empty search response invalid\n");
    exit(1);
  }
  $users = $json["users"] ?? [];
  if (count($users) !== 0) {
    fwrite(STDERR, "[FAIL] expected 0 results for nonsense query, got " . count($users) . "\n");
    exit(1);
  }
  fwrite(STDOUT, "[PASS] empty results for nonexistent user\n");
' "$RESP_SEARCH_EMPTY"

# Search without auth should be rejected
code=$(curl -sS -o "$RESP_SEARCH_NOAUTH" -w "%{http_code}" \
  "${BASE_URL}/api/users/search.php?query=searchuser")
assert_http "$code" "401" "search without auth"

echo "All search smoke checks passed"
