#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-http://localhost:8080}"
WORK_DIR="$(mktemp -d)"
COOKIE_ADMIN="${WORK_DIR}/admin.cookies"
COOKIE_UPLOADER="${WORK_DIR}/uploader.cookies"
COOKIE_OUTSIDER="${WORK_DIR}/outsider.cookies"
INDEX_ADMIN="${WORK_DIR}/admin_index.html"
INDEX_UPLOADER="${WORK_DIR}/uploader_index.html"
INDEX_OUTSIDER="${WORK_DIR}/outsider_index.html"
DASH_ADMIN="${WORK_DIR}/admin_dash.html"
DASH_UPLOADER="${WORK_DIR}/uploader_dash.html"
DASH_OUTSIDER="${WORK_DIR}/outsider_dash.html"
RESP_UPLOAD="${WORK_DIR}/upload.json"
RESP_TOGGLE="${WORK_DIR}/toggle.json"
RESP_FETCH_ADMIN="${WORK_DIR}/fetch_admin.json"
RESP_FETCH_UPLOADER="${WORK_DIR}/fetch_uploader.json"
RESP_FETCH_OUTSIDER="${WORK_DIR}/fetch_outsider.json"
RESP_SEND_OUTSIDER="${WORK_DIR}/send_outsider.json"
STICKER_FILE="${WORK_DIR}/tiny.png"

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
ADMIN_USER="st_admin_${rand_suffix}"
UPLOADER="st_uploader_${rand_suffix}"
OUTSIDER="st_outsider_${rand_suffix}"
PASS_ADMIN='Admin!234'
PASS_UPLOADER='Uploader!234'
PASS_OUTSIDER='Outsider!234'

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

assert_http_code() {
  local code="$1"
  local expected="$2"
  local label="$3"
  if [[ "$code" != "$expected" ]]; then
    echo "[FAIL] ${label}: expected HTTP ${expected}, got ${code}" >&2
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

echo "Running admin sticker visibility smoke checks against ${BASE_URL}"

login_user "$ADMIN_USER" "$PASS_ADMIN" "$COOKIE_ADMIN" "$INDEX_ADMIN" "Admin"
login_user "$UPLOADER" "$PASS_UPLOADER" "$COOKIE_UPLOADER" "$INDEX_UPLOADER" "Uploader"
login_user "$OUTSIDER" "$PASS_OUTSIDER" "$COOKIE_OUTSIDER" "$INDEX_OUTSIDER" "Outsider"

php -r '
require_once $argv[1] . "/includes/db.php";
$setAdmin = $pdo->prepare("UPDATE users SET is_admin = 1 WHERE username = ? LIMIT 1");
$setAdmin->execute([$argv[2]]);
if ((int) $setAdmin->rowCount() < 1) {
  fwrite(STDERR, "Unable to promote admin test user\n");
  exit(1);
}
' "$(cd "$(dirname "$0")/../.." && pwd)" "$ADMIN_USER"

echo "[PASS] admin test user promoted"

code=$(curl -sS -o "$DASH_ADMIN" -w "%{http_code}" -c "$COOKIE_ADMIN" -b "$COOKIE_ADMIN" "${BASE_URL}/dashboard.php")
assert_http_ok "$code" "admin dashboard"
CSRF_ADMIN="$(extract_dashboard_csrf "$DASH_ADMIN")" || {
  echo "[FAIL] Unable to extract dashboard CSRF token for admin" >&2
  exit 1
}

code=$(curl -sS -o "$DASH_UPLOADER" -w "%{http_code}" -c "$COOKIE_UPLOADER" -b "$COOKIE_UPLOADER" "${BASE_URL}/dashboard.php")
assert_http_ok "$code" "uploader dashboard"
CSRF_UPLOADER="$(extract_dashboard_csrf "$DASH_UPLOADER")" || {
  echo "[FAIL] Unable to extract dashboard CSRF token for uploader" >&2
  exit 1
}

code=$(curl -sS -o "$DASH_OUTSIDER" -w "%{http_code}" -c "$COOKIE_OUTSIDER" -b "$COOKIE_OUTSIDER" "${BASE_URL}/dashboard.php")
assert_http_ok "$code" "outsider dashboard"
CSRF_OUTSIDER="$(extract_dashboard_csrf "$DASH_OUTSIDER")" || {
  echo "[FAIL] Unable to extract dashboard CSRF token for outsider" >&2
  exit 1
}

php -r '
  $out = $argv[1];
  $r = random_int(0, 255);
  $g = random_int(0, 255);
  $b = random_int(0, 255);
  $signature = "\x89PNG\r\n\x1a\n";
  $ihdrData = pack("NNCCCCC", 1, 1, 8, 2, 0, 0, 0);
  $scanline = "\x00" . chr($r) . chr($g) . chr($b);
  $idatData = gzcompress($scanline, 9);
  $chunk = static function (string $type, string $data): string {
      $len = pack("N", strlen($data));
      $crc = pack("N", crc32($type . $data));
      return $len . $type . $data . $crc;
  };
  $png = $signature
      . $chunk("IHDR", $ihdrData)
      . $chunk("IDAT", $idatData)
      . $chunk("IEND", "");
  file_put_contents($out, $png);
' "$STICKER_FILE"

code=$(curl -sS -o "$RESP_UPLOAD" -w "%{http_code}" -c "$COOKIE_UPLOADER" -b "$COOKIE_UPLOADER" \
  -X POST "${BASE_URL}/api/messages/stickers/upload.php" \
  -H "X-CSRF-Token: ${CSRF_UPLOADER}" \
  -F "sticker_file=@${STICKER_FILE};type=image/png")
assert_http_ok "$code" "uploader upload sticker"

STICKER_ID="$(php -r '
  $json = json_decode(file_get_contents($argv[1]), true);
  if (!is_array($json) || ($json["status"] ?? "") !== "ok" || !isset($json["sticker"]["id"])) {
    fwrite(STDERR, "[FAIL] upload response invalid\n");
    exit(1);
  }
  echo (int) $json["sticker"]["id"];
' "$RESP_UPLOAD")" || {
  echo "[FAIL] Unable to extract sticker id" >&2
  exit 1
}

echo "[PASS] uploader sticker upload validated"

code=$(curl -sS -o "$RESP_TOGGLE" -w "%{http_code}" -c "$COOKIE_ADMIN" -b "$COOKIE_ADMIN" \
  -X POST "${BASE_URL}/api/admin/stickers/toggle_admin_only.php" \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: ${CSRF_ADMIN}" \
  -d "{\"sticker_id\":${STICKER_ID},\"is_admin_only\":true}")
assert_http_ok "$code" "admin toggle sticker admin-only"

php -r '
  $json = json_decode(file_get_contents($argv[1]), true);
  if (!is_array($json) || ($json["status"] ?? "") !== "ok" || !($json["is_admin_only"] ?? false)) {
    fwrite(STDERR, "[FAIL] toggle_admin_only response invalid\n");
    exit(1);
  }
  fwrite(STDOUT, "[PASS] admin-only flag toggle validated\n");
' "$RESP_TOGGLE"

code=$(curl -sS -o "$RESP_FETCH_ADMIN" -w "%{http_code}" -c "$COOKIE_ADMIN" -b "$COOKIE_ADMIN" \
  "${BASE_URL}/api/messages/stickers/fetch.php?limit=300")
assert_http_ok "$code" "admin sticker fetch"

php -r '
  $json = json_decode(file_get_contents($argv[1]), true);
  $stickerId = (int) $argv[2];
  if (!is_array($json) || ($json["status"] ?? "") !== "ok" || !is_array($json["stickers"] ?? null)) {
    fwrite(STDERR, "[FAIL] admin sticker fetch invalid\n");
    exit(1);
  }
  foreach ($json["stickers"] as $item) {
    if ((int) ($item["id"] ?? 0) === $stickerId) {
      fwrite(STDOUT, "[PASS] admin can view admin-only sticker\n");
      exit(0);
    }
  }
  fwrite(STDERR, "[FAIL] admin cannot find admin-only sticker\n");
  exit(1);
' "$RESP_FETCH_ADMIN" "$STICKER_ID"

code=$(curl -sS -o "$RESP_FETCH_UPLOADER" -w "%{http_code}" -c "$COOKIE_UPLOADER" -b "$COOKIE_UPLOADER" \
  "${BASE_URL}/api/messages/stickers/fetch.php?limit=300")
assert_http_ok "$code" "uploader sticker fetch"

php -r '
  $json = json_decode(file_get_contents($argv[1]), true);
  $stickerId = (int) $argv[2];
  if (!is_array($json) || ($json["status"] ?? "") !== "ok" || !is_array($json["stickers"] ?? null)) {
    fwrite(STDERR, "[FAIL] uploader sticker fetch invalid\n");
    exit(1);
  }
  foreach ($json["stickers"] as $item) {
    if ((int) ($item["id"] ?? 0) === $stickerId) {
      fwrite(STDOUT, "[PASS] uploader can view own admin-only sticker\n");
      exit(0);
    }
  }
  fwrite(STDERR, "[FAIL] uploader cannot find own admin-only sticker\n");
  exit(1);
' "$RESP_FETCH_UPLOADER" "$STICKER_ID"

code=$(curl -sS -o "$RESP_FETCH_OUTSIDER" -w "%{http_code}" -c "$COOKIE_OUTSIDER" -b "$COOKIE_OUTSIDER" \
  "${BASE_URL}/api/messages/stickers/fetch.php?limit=300")
assert_http_ok "$code" "outsider sticker fetch"

php -r '
  $json = json_decode(file_get_contents($argv[1]), true);
  $stickerId = (int) $argv[2];
  if (!is_array($json) || ($json["status"] ?? "") !== "ok" || !is_array($json["stickers"] ?? null)) {
    fwrite(STDERR, "[FAIL] outsider sticker fetch invalid\n");
    exit(1);
  }
  foreach ($json["stickers"] as $item) {
    if ((int) ($item["id"] ?? 0) === $stickerId) {
      fwrite(STDERR, "[FAIL] outsider can see admin-only sticker\n");
      exit(1);
    }
  }
  fwrite(STDOUT, "[PASS] outsider cannot see admin-only sticker\n");
' "$RESP_FETCH_OUTSIDER" "$STICKER_ID"

code=$(curl -sS -o /dev/null -w "%{http_code}" -c "$COOKIE_OUTSIDER" -b "$COOKIE_OUTSIDER" \
  "${BASE_URL}/api/messages/stickers/get.php?id=${STICKER_ID}")
assert_http_code "$code" "404" "outsider sticker binary access"

echo "[PASS] outsider cannot get admin-only sticker binary"

code=$(curl -sS -o /dev/null -w "%{http_code}" -c "$COOKIE_UPLOADER" -b "$COOKIE_UPLOADER" \
  "${BASE_URL}/api/messages/stickers/get.php?id=${STICKER_ID}")
assert_http_code "$code" "200" "uploader sticker binary access"

echo "[PASS] uploader can get own admin-only sticker binary"

code=$(curl -sS -o "$RESP_SEND_OUTSIDER" -w "%{http_code}" -c "$COOKIE_OUTSIDER" -b "$COOKIE_OUTSIDER" \
  -X POST "${BASE_URL}/api/messages/stickers/send.php" \
  -H "X-CSRF-Token: ${CSRF_OUTSIDER}" \
  --data-urlencode "target=${UPLOADER}" \
  --data-urlencode "sticker_id=${STICKER_ID}")
assert_http_code "$code" "403" "outsider send admin-only sticker"

php -r '
  $json = json_decode(file_get_contents($argv[1]), true);
  if (!is_array($json) || ($json["status"] ?? "") !== "error") {
    fwrite(STDERR, "[FAIL] outsider send response invalid\n");
    exit(1);
  }
  fwrite(STDOUT, "[PASS] outsider cannot send admin-only sticker\n");
' "$RESP_SEND_OUTSIDER"

echo "All admin sticker visibility smoke checks passed"
