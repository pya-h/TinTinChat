#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-http://localhost:8080}"
WORK_DIR="$(mktemp -d)"
COOKIE_SUPER="${WORK_DIR}/super.cookies"
COOKIE_B="${WORK_DIR}/b.cookies"
COOKIE_C="${WORK_DIR}/c.cookies"
INDEX_SUPER="${WORK_DIR}/super_index.html"
INDEX_B="${WORK_DIR}/b_index.html"
INDEX_C="${WORK_DIR}/c_index.html"
DASH_SUPER="${WORK_DIR}/super_dash.html"
RESP_SEND_FILE="${WORK_DIR}/send_file.json"
RESP_FORWARD="${WORK_DIR}/forward.json"
RESP_ANALYZE="${WORK_DIR}/analyze.json"
RESP_CLEANUP="${WORK_DIR}/cleanup.json"
RESP_NON_SUPER="${WORK_DIR}/cleanup_non_super.json"

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
SUPERUSER="${SUPERUSER_USERNAME:-paya}"
SUPER_PASS='SuperMedia!234'
USER_B="media_b_${rand_suffix}"
USER_C="media_c_${rand_suffix}"
PASS='MediaTest!234'

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

assert_http_code() {
  local code="$1"
  local expected="$2"
  local label="$3"
  if [[ "$code" != "$expected" ]]; then
    echo "[FAIL] ${label}: expected HTTP ${expected}, got ${code}" >&2
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

echo "Running admin media cleanup smoke checks against ${BASE_URL}"

# Ensure configured superuser account exists with known credentials.
php -r '
require_once $argv[1] . "/includes/db.php";
$username = $argv[2];
$password = $argv[3];
$stmt = $pdo->prepare("SELECT id FROM users WHERE username = ? LIMIT 1");
$stmt->execute([$username]);
$id = (int) ($stmt->fetchColumn() ?: 0);
$hash = password_hash($password, PASSWORD_DEFAULT);
if ($id > 0) {
    $upd = $pdo->prepare("UPDATE users SET password_hash = ?, banned_at = NULL, is_admin = 1 WHERE id = ?");
    $upd->execute([$hash, $id]);
    exit(0);
}
$config = ["private_key_type" => OPENSSL_KEYTYPE_RSA, "private_key_bits" => 2048];
$res = openssl_pkey_new($config);
if ($res === false) {
    fwrite(STDERR, "unable to generate keypair\n");
    exit(1);
}
openssl_pkey_export($res, $privatePem);
$details = openssl_pkey_get_details($res);
$publicPem = $details["key"] ?? "";
if ($privatePem === "" || $publicPem === "") {
    fwrite(STDERR, "unable to export keypair\n");
    exit(1);
}
$ins = $pdo->prepare("INSERT INTO users (username, password_hash, public_key, private_key, is_admin) VALUES (?, ?, ?, ?, 1)");
$ins->execute([$username, $hash, $publicPem, $privatePem]);
' "$(cd "$(dirname "$0")/../.." && pwd)" "$SUPERUSER" "$SUPER_PASS"

echo "[PASS] superuser ensured (${SUPERUSER})"

login_user "$SUPERUSER" "$SUPER_PASS" "$COOKIE_SUPER" "$INDEX_SUPER" "Superuser"
login_user "$USER_B" "$PASS" "$COOKIE_B" "$INDEX_B" "User B"
login_user "$USER_C" "$PASS" "$COOKIE_C" "$INDEX_C" "User C"

code=$(curl -sS -o "$DASH_SUPER" -w "%{http_code}" -c "$COOKIE_SUPER" -b "$COOKIE_SUPER" "${BASE_URL}/dashboard.php")
assert_http_ok "$code" "superuser dashboard"
CSRF_SUPER="$(extract_dashboard_csrf "$DASH_SUPER")" || {
  echo "[FAIL] Unable to extract dashboard CSRF token for superuser" >&2
  exit 1
}

echo "[PASS] superuser dashboard csrf token extracted"

TEST_FILE="${WORK_DIR}/cleanup_target.bin"
php -r 'file_put_contents($argv[1], random_bytes(2 * 1024 * 1024));' "$TEST_FILE"

code=$(curl -sS -o "$RESP_SEND_FILE" -w "%{http_code}" -c "$COOKIE_SUPER" -b "$COOKIE_SUPER" \
  -X POST "${BASE_URL}/api/messages/media/send_file.php" \
  -H "X-CSRF-Token: ${CSRF_SUPER}" \
  -F "target=${USER_B}" \
  -F "message=enc_payload_for_b" \
  -F "message_for_sender=enc_payload_for_super" \
  -F "message_type=file" \
  -F "file=@${TEST_FILE};filename=cleanup_target.bin")
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

code=$(curl -sS -o "$RESP_FORWARD" -w "%{http_code}" -c "$COOKIE_SUPER" -b "$COOKIE_SUPER" \
  -X POST "${BASE_URL}/api/messages/media/forward_media.php" \
  -H "X-CSRF-Token: ${CSRF_SUPER}" \
  --data-urlencode "source_message_id=${ORIGINAL_ID}" \
  --data-urlencode "target=${USER_C}" \
  --data-urlencode "message=enc_payload_for_c" \
  --data-urlencode "message_for_sender=enc_payload_for_super_forward")
assert_http_ok "$code" "forward file without re-upload"

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

# Make test messages old enough to be eligible for cleanup.
php -r '
require_once $argv[1] . "/includes/db.php";
$ids = [ (int) $argv[2], (int) $argv[3] ];
$stmt = $pdo->prepare("UPDATE messages SET created_at = DATE_SUB(NOW(), INTERVAL 3 DAY) WHERE id = ?");
foreach ($ids as $id) {
    $stmt->execute([$id]);
}
' "$(cd "$(dirname "$0")/../.." && pwd)" "$ORIGINAL_ID" "$FORWARDED_ID"

# Non-superuser should be blocked from admin cleanup endpoint.
DASH_B="${WORK_DIR}/b_dash.html"
code=$(curl -sS -o "$DASH_B" -w "%{http_code}" -c "$COOKIE_B" -b "$COOKIE_B" "${BASE_URL}/dashboard.php")
assert_http_ok "$code" "user B dashboard"
CSRF_B="$(extract_dashboard_csrf "$DASH_B")"

code=$(curl -sS -o "$RESP_NON_SUPER" -w "%{http_code}" -c "$COOKIE_B" -b "$COOKIE_B" \
  -X POST "${BASE_URL}/api/admin/media_cleanup.php" \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: ${CSRF_B}" \
  -d '{"older_than_days":1,"max_size_bytes":1000000,"include_saved_messages":true,"include_playlists":true}')
assert_http_code "$code" "403" "non-superuser media_cleanup denied"
echo "[PASS] non-superuser denied from media cleanup"

code=$(curl -sS -o "$RESP_ANALYZE" -w "%{http_code}" -c "$COOKIE_SUPER" -b "$COOKIE_SUPER" \
  "${BASE_URL}/api/admin/media_analyze.php?older_than_days=1&max_size_bytes=1000000&include_saved_messages=1&include_playlists=1")
assert_http_ok "$code" "media analyze"

php -r '
  $json = json_decode(file_get_contents($argv[1]), true);
  if (!is_array($json) || ($json["status"] ?? "") !== "ok") {
    fwrite(STDERR, "[FAIL] media analyze response invalid\n");
    exit(1);
  }
  if ((int) ($json["total_files"] ?? 0) < 1) {
    fwrite(STDERR, "[FAIL] media analyze should report at least one file\n");
    exit(1);
  }
  fwrite(STDOUT, "[PASS] media analyze response validated\n");
' "$RESP_ANALYZE"

code=$(curl -sS -o "$RESP_CLEANUP" -w "%{http_code}" -c "$COOKIE_SUPER" -b "$COOKIE_SUPER" \
  -X POST "${BASE_URL}/api/admin/media_cleanup.php" \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: ${CSRF_SUPER}" \
  -d '{"older_than_days":1,"max_size_bytes":1000000,"include_saved_messages":true,"include_playlists":true}')
assert_http_ok "$code" "media cleanup"

php -r '
  $json = json_decode(file_get_contents($argv[1]), true);
  if (!is_array($json) || ($json["status"] ?? "") !== "ok") {
    fwrite(STDERR, "[FAIL] media cleanup response invalid\n");
    exit(1);
  }
  $deleted = (int) ($json["deleted_count"] ?? 0);
  if ($deleted < 1) {
    fwrite(STDERR, "[FAIL] media cleanup should delete at least one eligible file\n");
    exit(1);
  }
  fwrite(STDOUT, "[PASS] media cleanup deleted eligible files\n");
' "$RESP_CLEANUP"

php -r '
require_once $argv[1] . "/includes/db.php";
$idA = (int) $argv[2];
$idB = (int) $argv[3];
$expectedFile = (string) $argv[4];
$stmt = $pdo->prepare("SELECT id, any_file_path, file_purged_at FROM messages WHERE id IN (?, ?) ORDER BY id ASC");
$stmt->execute([$idA, $idB]);
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
if (count($rows) !== 2) {
    fwrite(STDERR, "[FAIL] expected 2 message rows for verification\n");
    exit(1);
}
foreach ($rows as $row) {
    if ((string) ($row["any_file_path"] ?? "") !== $expectedFile) {
        fwrite(STDERR, "[FAIL] forwarded pair no longer share same any_file_path\n");
        exit(1);
    }
    if (empty($row["file_purged_at"])) {
        fwrite(STDERR, "[FAIL] expected file_purged_at set on all shared-file rows\n");
        exit(1);
    }
}
$fullPath = $argv[1] . "/uploads/files/" . $expectedFile;
if (file_exists($fullPath)) {
    fwrite(STDERR, "[FAIL] expected physical file removed by cleanup\n");
    exit(1);
}
fwrite(STDOUT, "[PASS] both rows purged and file removed\n");
' "$(cd "$(dirname "$0")/../.." && pwd)" "$ORIGINAL_ID" "$FORWARDED_ID" "$ORIGINAL_FILE"

echo "All admin media cleanup smoke checks passed"
