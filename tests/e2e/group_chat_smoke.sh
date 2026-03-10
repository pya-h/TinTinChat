#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-http://localhost:8080}"
WORK_DIR="$(mktemp -d)"
COOKIE_A="${WORK_DIR}/user_a.cookies"
COOKIE_B="${WORK_DIR}/user_b.cookies"
INDEX_A="${WORK_DIR}/index_a.html"
INDEX_B="${WORK_DIR}/index_b.html"
DASH_A="${WORK_DIR}/dash_a.html"
DASH_B="${WORK_DIR}/dash_b.html"
RESP_CREATE_GROUP="${WORK_DIR}/create_group.json"
RESP_FETCH_GROUPS_A="${WORK_DIR}/fetch_groups_a.json"
RESP_JOIN_GROUP="${WORK_DIR}/join_group.json"
RESP_GROUP_DETAILS_B="${WORK_DIR}/group_details_b.json"
RESP_SEND_GROUP_TEXT="${WORK_DIR}/send_group_text.json"
RESP_FETCH_GROUP_MSG_B="${WORK_DIR}/fetch_group_messages_b.json"
RESP_LEAVE_GROUP_B="${WORK_DIR}/leave_group_b.json"
RESP_GROUP_DETAILS_A="${WORK_DIR}/group_details_a.json"

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
USER_A="phaseh_grp_a_${rand_suffix}"
USER_B="phaseh_grp_b_${rand_suffix}"
PASS_A='PhaseHGrp!234'
PASS_B='PhaseHGrp!567'
GROUP_TITLE="phase_h_group_${rand_suffix}"
GROUP_DESCRIPTION="phase h group smoke"
GROUP_TEXT="phase_h_group_message_${rand_suffix}"

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
  if [[ "$code" != "200" && "$code" != "201" ]]; then
    echo "[FAIL] ${label}: expected HTTP 200/201, got ${code}" >&2
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
    -X POST "${BASE_URL}/api/auth/login.php" \
    --data-urlencode "username=${user}" \
    --data-urlencode "password=${pass}" \
    --data-urlencode "csrf_token=${csrf}")
  assert_http_redirect "$code" "${tag} login"

  echo "[PASS] ${tag} login ok"
}

echo "Running group chat smoke checks against ${BASE_URL}"

login_user "$USER_A" "$PASS_A" "$COOKIE_A" "$INDEX_A" "User A"
login_user "$USER_B" "$PASS_B" "$COOKIE_B" "$INDEX_B" "User B"

code=$(curl -sS -o "$DASH_A" -w "%{http_code}" -c "$COOKIE_A" -b "$COOKIE_A" "${BASE_URL}/dashboard.php")
assert_http_ok "$code" "User A dashboard"
CSRF_A="$(extract_dashboard_csrf "$DASH_A")" || {
  echo "[FAIL] Unable to extract dashboard CSRF token for user A" >&2
  exit 1
}

code=$(curl -sS -o "$DASH_B" -w "%{http_code}" -c "$COOKIE_B" -b "$COOKIE_B" "${BASE_URL}/dashboard.php")
assert_http_ok "$code" "User B dashboard"
CSRF_B="$(extract_dashboard_csrf "$DASH_B")" || {
  echo "[FAIL] Unable to extract dashboard CSRF token for user B" >&2
  exit 1
}

echo "[PASS] Dashboard CSRF tokens extracted"

code=$(curl -sS -o "$RESP_CREATE_GROUP" -w "%{http_code}" -c "$COOKIE_A" -b "$COOKIE_A" \
  -X POST "${BASE_URL}/api/groups/create.php" \
  -H "X-CSRF-Token: ${CSRF_A}" \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"${GROUP_TITLE}\",\"description\":\"${GROUP_DESCRIPTION}\"}")
assert_http_ok "$code" "create group"

GROUP_ID="$(php -r '
  $json = json_decode(file_get_contents($argv[1]), true);
  if (!is_array($json) || ($json["status"] ?? "") !== "ok" || !isset($json["group"]["id"])) {
    fwrite(STDERR, "[FAIL] create_group response invalid\n");
    exit(1);
  }
  echo (int) $json["group"]["id"];
' "$RESP_CREATE_GROUP")" || {
  echo "[FAIL] Unable to extract group id" >&2
  exit 1
}

JOIN_TOKEN="$(php -r '
  $json = json_decode(file_get_contents($argv[1]), true);
  if (!is_array($json) || ($json["status"] ?? "") !== "ok" || empty($json["group"]["join_token"])) {
    fwrite(STDERR, "[FAIL] create_group join token missing\n");
    exit(1);
  }
  echo (string) $json["group"]["join_token"];
' "$RESP_CREATE_GROUP")" || {
  echo "[FAIL] Unable to extract join token" >&2
  exit 1
}

echo "[PASS] group created"

code=$(curl -sS -o "$RESP_FETCH_GROUPS_A" -w "%{http_code}" -c "$COOKIE_A" -b "$COOKIE_A" \
  "${BASE_URL}/api/groups/fetch.php")
assert_http_ok "$code" "fetch groups for owner"

php -r '
  $json = json_decode(file_get_contents($argv[1]), true);
  $groupId = (int) $argv[2];
  if (!is_array($json) || ($json["status"] ?? "") !== "ok" || !is_array($json["groups"] ?? null)) {
    fwrite(STDERR, "[FAIL] fetch_groups response invalid\n");
    exit(1);
  }
  $found = false;
  foreach ($json["groups"] as $group) {
    if ((int) ($group["id"] ?? 0) === $groupId) {
      $found = true;
      break;
    }
  }
  if (!$found) {
    fwrite(STDERR, "[FAIL] created group missing from owner group list\n");
    exit(1);
  }
  fwrite(STDOUT, "[PASS] owner group list includes created group\n");
' "$RESP_FETCH_GROUPS_A" "$GROUP_ID"

code=$(curl -sS -o "$RESP_JOIN_GROUP" -w "%{http_code}" -c "$COOKIE_B" -b "$COOKIE_B" \
  -X POST "${BASE_URL}/api/groups/join.php" \
  -H "X-CSRF-Token: ${CSRF_B}" \
  -H "Content-Type: application/json" \
  -d "{\"token\":\"${JOIN_TOKEN}\"}")
assert_http_ok "$code" "join group"

php -r '
  $json = json_decode(file_get_contents($argv[1]), true);
  $groupId = (int) $argv[2];
  if (!is_array($json) || ($json["status"] ?? "") !== "ok" || (int) ($json["group"]["id"] ?? 0) !== $groupId) {
    fwrite(STDERR, "[FAIL] join_group response invalid\n");
    exit(1);
  }
  if (($json["role"] ?? "") !== "member") {
    fwrite(STDERR, "[FAIL] join_group expected role member\n");
    exit(1);
  }
  fwrite(STDOUT, "[PASS] join group validated\n");
' "$RESP_JOIN_GROUP" "$GROUP_ID"

code=$(curl -sS -o "$RESP_GROUP_DETAILS_B" -w "%{http_code}" -c "$COOKIE_B" -b "$COOKIE_B" \
  "${BASE_URL}/api/groups/fetch_details.php?group_id=${GROUP_ID}")
assert_http_ok "$code" "fetch group details as member"

php -r '
  $json = json_decode(file_get_contents($argv[1]), true);
  $userA = $argv[2];
  $userB = $argv[3];
  if (!is_array($json) || ($json["status"] ?? "") !== "ok" || !is_array($json["members"] ?? null)) {
    fwrite(STDERR, "[FAIL] fetch_group_details response invalid\n");
    exit(1);
  }
  if (($json["role"] ?? "") !== "member") {
    fwrite(STDERR, "[FAIL] member role mismatch in group details\n");
    exit(1);
  }
  $seenA = false;
  $seenB = false;
  foreach ($json["members"] as $member) {
    $u = (string) ($member["username"] ?? "");
    if ($u === $userA) { $seenA = true; }
    if ($u === $userB) { $seenB = true; }
  }
  if (!$seenA || !$seenB) {
    fwrite(STDERR, "[FAIL] expected group members not found in details\n");
    exit(1);
  }
  fwrite(STDOUT, "[PASS] group details member list validated\n");
' "$RESP_GROUP_DETAILS_B" "$USER_A" "$USER_B"

code=$(curl -sS -o "$RESP_SEND_GROUP_TEXT" -w "%{http_code}" -c "$COOKIE_A" -b "$COOKIE_A" \
  -X POST "${BASE_URL}/api/messages/send_text.php" \
  -H "X-CSRF-Token: ${CSRF_A}" \
  --data-urlencode "group_id=${GROUP_ID}" \
  --data-urlencode "message=${GROUP_TEXT}" \
  --data-urlencode "message_for_sender=${GROUP_TEXT}")
assert_http_ok "$code" "send group text"

GROUP_MESSAGE_ID="$(php -r '
  $json = json_decode(file_get_contents($argv[1]), true);
  if (!is_array($json) || ($json["status"] ?? "") !== "ok" || empty($json["message_id"])) {
    fwrite(STDERR, "[FAIL] send group text response invalid\n");
    exit(1);
  }
  echo (int) $json["message_id"];
' "$RESP_SEND_GROUP_TEXT")" || {
  echo "[FAIL] Unable to extract group message id" >&2
  exit 1
}

echo "[PASS] group text sent"

code=$(curl -sS -o "$RESP_FETCH_GROUP_MSG_B" -w "%{http_code}" -c "$COOKIE_B" -b "$COOKIE_B" \
  "${BASE_URL}/api/messages/fetch.php?group_id=${GROUP_ID}&limit=20")
assert_http_ok "$code" "fetch group messages as member"

php -r '
  $json = json_decode(file_get_contents($argv[1]), true);
  $expectedId = (int) $argv[2];
  $expectedMessage = $argv[3];
  if (!is_array($json) || ($json["status"] ?? "") !== "ok" || !is_array($json["messages"] ?? null)) {
    fwrite(STDERR, "[FAIL] fetch group messages response invalid\n");
    exit(1);
  }
  $found = false;
  foreach ($json["messages"] as $message) {
    if ((int) ($message["id"] ?? 0) === $expectedId && ($message["message"] ?? "") === $expectedMessage) {
      $found = true;
      break;
    }
  }
  if (!$found) {
    fwrite(STDERR, "[FAIL] expected group message missing in member fetch\n");
    exit(1);
  }
  fwrite(STDOUT, "[PASS] member fetched group text message\n");
' "$RESP_FETCH_GROUP_MSG_B" "$GROUP_MESSAGE_ID" "$GROUP_TEXT"

code=$(curl -sS -o "$RESP_LEAVE_GROUP_B" -w "%{http_code}" -c "$COOKIE_B" -b "$COOKIE_B" \
  -X POST "${BASE_URL}/api/groups/leave.php" \
  -H "X-CSRF-Token: ${CSRF_B}" \
  -H "Content-Type: application/json" \
  -d "{\"group_id\":${GROUP_ID}}")
assert_http_ok "$code" "leave group as member"

php -r '
  $json = json_decode(file_get_contents($argv[1]), true);
  if (!is_array($json) || ($json["status"] ?? "") !== "ok") {
    fwrite(STDERR, "[FAIL] leave_group response invalid\n");
    exit(1);
  }
  if (!array_key_exists("group_deleted", $json) || (bool) $json["group_deleted"] !== false) {
    fwrite(STDERR, "[FAIL] leave_group should not delete group when member leaves\n");
    exit(1);
  }
  fwrite(STDOUT, "[PASS] member leave group validated\n");
' "$RESP_LEAVE_GROUP_B"

code=$(curl -sS -o "$RESP_GROUP_DETAILS_A" -w "%{http_code}" -c "$COOKIE_A" -b "$COOKIE_A" \
  "${BASE_URL}/api/groups/fetch_details.php?group_id=${GROUP_ID}")
assert_http_ok "$code" "fetch group details as owner after leave"

php -r '
  $json = json_decode(file_get_contents($argv[1]), true);
  $userB = $argv[2];
  if (!is_array($json) || ($json["status"] ?? "") !== "ok" || !is_array($json["members"] ?? null)) {
    fwrite(STDERR, "[FAIL] owner group details response invalid\n");
    exit(1);
  }
  foreach ($json["members"] as $member) {
    if ((string) ($member["username"] ?? "") === $userB) {
      fwrite(STDERR, "[FAIL] member still present after leave\n");
      exit(1);
    }
  }
  fwrite(STDOUT, "[PASS] group membership updated after leave\n");
' "$RESP_GROUP_DETAILS_A" "$USER_B"

echo "All group chat smoke checks passed"
