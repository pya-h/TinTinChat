#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-http://localhost:8080}"
WORK_DIR="$(mktemp -d)"
COOKIE_A="${WORK_DIR}/a.cookies"
COOKIE_B="${WORK_DIR}/b.cookies"
COOKIE_C="${WORK_DIR}/c.cookies"
INDEX_A="${WORK_DIR}/a_index.html"
INDEX_B="${WORK_DIR}/b_index.html"
INDEX_C="${WORK_DIR}/c_index.html"
DASH_A="${WORK_DIR}/a_dash.html"
RESP_SEND_FILE="${WORK_DIR}/send_file.json"
RESP_FORWARD="${WORK_DIR}/forward.json"
RESP_DELETE_FORWARD="${WORK_DIR}/delete_forward.json"
RESP_FETCH_B="${WORK_DIR}/fetch_b.json"

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
USER_A="fwd_del_a_${rand_suffix}"
USER_B="fwd_del_b_${rand_suffix}"
USER_C="fwd_del_c_${rand_suffix}"
PASS='FwdDelete!234'

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

echo "Running forwarded-delete safety smoke checks against ${BASE_URL}"

login_user "$USER_A" "$PASS" "$COOKIE_A" "$INDEX_A" "User A"
login_user "$USER_B" "$PASS" "$COOKIE_B" "$INDEX_B" "User B"
login_user "$USER_C" "$PASS" "$COOKIE_C" "$INDEX_C" "User C"

code=$(curl -sS -o "$DASH_A" -w "%{http_code}" -c "$COOKIE_A" -b "$COOKIE_A" "${BASE_URL}/dashboard.php")
assert_http_ok "$code" "User A dashboard"
CSRF_A="$(extract_dashboard_csrf "$DASH_A")" || {
  echo "[FAIL] Unable to extract dashboard CSRF token for user A" >&2
  exit 1
}

TEST_FILE="${WORK_DIR}/forward_delete_target.bin"
printf 'forward-delete-target-%s' "${rand_suffix}" >"${TEST_FILE}"

code=$(curl -sS -o "$RESP_SEND_FILE" -w "%{http_code}" -c "$COOKIE_A" -b "$COOKIE_A" \
  -X POST "${BASE_URL}/api/messages/media/send_file.php" \
  -H "X-CSRF-Token: ${CSRF_A}" \
  -F "target=${USER_B}" \
  -F "message=enc_payload_b" \
  -F "message_for_sender=enc_payload_a" \
  -F "message_type=file" \
  -F "file=@${TEST_FILE};filename=forward_delete_target.bin")
assert_http_ok "$code" "send original file"

ORIGINAL_ID="$(php -r '
  $json = json_decode(file_get_contents($argv[1]), true);
  if (!is_array($json) || ($json["status"] ?? "") !== "ok" || empty($json["message_id"])) {
    exit(1);
  }
  echo (int) $json["message_id"];
' "$RESP_SEND_FILE")" || {
  echo "[FAIL] Unable to extract original message id" >&2
  exit 1
}

ORIGINAL_FILE="$(php -r '
  $json = json_decode(file_get_contents($argv[1]), true);
  if (!is_array($json) || ($json["status"] ?? "") !== "ok" || empty($json["file_path"])) {
    exit(1);
  }
  echo (string) $json["file_path"];
' "$RESP_SEND_FILE")" || {
  echo "[FAIL] Unable to extract original file path" >&2
  exit 1
}

code=$(curl -sS -o "$RESP_FORWARD" -w "%{http_code}" -c "$COOKIE_A" -b "$COOKIE_A" \
  -X POST "${BASE_URL}/api/messages/media/forward_media.php" \
  -H "X-CSRF-Token: ${CSRF_A}" \
  --data-urlencode "source_message_id=${ORIGINAL_ID}" \
  --data-urlencode "target=${USER_C}" \
  --data-urlencode "message=enc_payload_c" \
  --data-urlencode "message_for_sender=enc_payload_a_forward")
assert_http_ok "$code" "forward file"

FORWARDED_ID="$(php -r '
  $json = json_decode(file_get_contents($argv[1]), true);
  if (!is_array($json) || ($json["status"] ?? "") !== "ok" || empty($json["message_id"])) {
    exit(1);
  }
  echo (int) $json["message_id"];
' "$RESP_FORWARD")" || {
  echo "[FAIL] Unable to extract forwarded message id" >&2
  exit 1
}

echo "[PASS] original + forwarded message created (${ORIGINAL_ID}, ${FORWARDED_ID})"

code=$(curl -sS -o "$RESP_DELETE_FORWARD" -w "%{http_code}" -c "$COOKIE_A" -b "$COOKIE_A" \
  -X DELETE "${BASE_URL}/api/messages/delete.php" \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: ${CSRF_A}" \
  -d "{\"messages\":[${FORWARDED_ID}]}" )
assert_http_ok "$code" "delete forwarded message"

php -r '
  $json = json_decode(file_get_contents($argv[1]), true);
  $forwardedId = (int) $argv[2];
  if (!is_array($json) || ($json["status"] ?? "") !== "ok") {
    fwrite(STDERR, "[FAIL] delete forwarded response invalid\n");
    exit(1);
  }
  if ((int) ($json["messages_deleted"] ?? 0) < 1) {
    fwrite(STDERR, "[FAIL] forwarded row was not deleted\n");
    exit(1);
  }
  if ((int) ($json["files_deleted"] ?? -1) !== 0) {
    fwrite(STDERR, "[FAIL] deleting forwarded copy must not unlink physical file\n");
    exit(1);
  }
  if (!in_array($forwardedId, array_map("intval", (array) ($json["message_ids"] ?? [])), true)) {
    fwrite(STDERR, "[FAIL] forwarded id missing in deleted id list\n");
    exit(1);
  }
  fwrite(STDOUT, "[PASS] forwarded delete keeps files_deleted=0\n");
' "$RESP_DELETE_FORWARD" "$FORWARDED_ID"

php -r '
require_once $argv[1] . "/includes/db.php";
$originalId = (int) $argv[2];
$forwardedId = (int) $argv[3];
$fileName = (string) $argv[4];

$stmt = $pdo->prepare("SELECT id, any_file_path, forwarded_from_message_id FROM messages WHERE id = ? LIMIT 1");
$stmt->execute([$originalId]);
$original = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$original) {
    fwrite(STDERR, "[FAIL] original message row missing after forwarded delete\n");
    exit(1);
}
if ((string) ($original["any_file_path"] ?? "") !== $fileName) {
    fwrite(STDERR, "[FAIL] original row file path changed unexpectedly\n");
    exit(1);
}

$stmt2 = $pdo->prepare("SELECT id FROM messages WHERE id = ? LIMIT 1");
$stmt2->execute([$forwardedId]);
if ($stmt2->fetch()) {
    fwrite(STDERR, "[FAIL] forwarded row still exists after delete\n");
    exit(1);
}

$fullPath = $argv[1] . "/uploads/files/" . $fileName;
if (!file_exists($fullPath)) {
    fwrite(STDERR, "[FAIL] physical file was unlinked by forwarded delete\n");
    exit(1);
}
fwrite(STDOUT, "[PASS] original row + physical file preserved after forwarded delete\n");
' "$(cd "$(dirname "$0")/../.." && pwd)" "$ORIGINAL_ID" "$FORWARDED_ID" "$ORIGINAL_FILE"

code=$(curl -sS -o "$RESP_FETCH_B" -w "%{http_code}" -c "$COOKIE_B" -b "$COOKIE_B" \
  "${BASE_URL}/api/messages/fetch.php?with=${USER_A}&limit=30")
assert_http_ok "$code" "fetch by original receiver"

php -r '
  $json = json_decode(file_get_contents($argv[1]), true);
  $originalId = (int) $argv[2];
  if (!is_array($json) || ($json["status"] ?? "") !== "ok" || !is_array($json["messages"] ?? null)) {
    fwrite(STDERR, "[FAIL] receiver fetch response invalid\n");
    exit(1);
  }
  foreach ($json["messages"] as $row) {
    if ((int) ($row["id"] ?? 0) === $originalId) {
      fwrite(STDOUT, "[PASS] original message still visible to receiver\n");
      exit(0);
    }
  }
  fwrite(STDERR, "[FAIL] original message missing in receiver fetch\n");
  exit(1);
' "$RESP_FETCH_B" "$ORIGINAL_ID"

echo "All forwarded-delete safety smoke checks passed"
