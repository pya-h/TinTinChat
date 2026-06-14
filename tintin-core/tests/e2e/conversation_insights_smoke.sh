#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-http://localhost:8080}"
WORK_DIR="$(mktemp -d)"
COOKIE_A="${WORK_DIR}/a.cookies"
COOKIE_B="${WORK_DIR}/b.cookies"
INDEX_A="${WORK_DIR}/a_index.html"
INDEX_B="${WORK_DIR}/b_index.html"
DASH_A="${WORK_DIR}/a_dash.html"

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
USER_A="insight_a_${rand_suffix}"
USER_B="insight_b_${rand_suffix}"
PASS='InsightTest!234'

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
    if (preg_match("/const\\s+CSRF_TOKEN\\s*=\\s*\"([^\"]+)\"/", $html, $m)) {
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

send_text_message() {
  local cookie_file="$1"
  local csrf_token="$2"
  local target="$3"
  local text="$4"
  local out_file="$5"

  local code
  code=$(curl -sS -o "$out_file" -w "%{http_code}" -c "$cookie_file" -b "$cookie_file" \
    -X POST "${BASE_URL}/api/messages/send_text.php" \
    -H "X-CSRF-Token: ${csrf_token}" \
    --data-urlencode "target=${target}" \
    --data-urlencode "message=${text}" \
    --data-urlencode "message_for_sender=${text}_sender")
  assert_http "$code" "200" "send text message"

  php -r '
    $json = json_decode(file_get_contents($argv[1]), true);
    if (!is_array($json) || ($json["status"] ?? "") !== "ok" || empty($json["message_id"])) {
      exit(1);
    }
    echo (int) $json["message_id"];
  ' "$out_file"
}

send_group_text_message() {
  local cookie_file="$1"
  local csrf_token="$2"
  local group_id="$3"
  local text="$4"
  local out_file="$5"

  local code
  code=$(curl -sS -o "$out_file" -w "%{http_code}" -c "$cookie_file" -b "$cookie_file" \
    -X POST "${BASE_URL}/api/messages/send_text.php" \
    -H "X-CSRF-Token: ${csrf_token}" \
    --data-urlencode "group_id=${group_id}" \
    --data-urlencode "message=${text}" \
    --data-urlencode "message_for_sender=${text}_sender")
  assert_http "$code" "200" "send group text message"
}

send_file_message() {
  local cookie_file="$1"
  local csrf_token="$2"
  local target="$3"
  local file_path="$4"
  local out_file="$5"

  local code
  code=$(curl -sS -o "$out_file" -w "%{http_code}" -c "$cookie_file" -b "$cookie_file" \
    -X POST "${BASE_URL}/api/messages/media/send_file.php" \
    -H "X-CSRF-Token: ${csrf_token}" \
    -F "target=${target}" \
    -F "message=media_envelope_${RANDOM}" \
    -F "message_for_sender=media_envelope_sender_${RANDOM}" \
    -F "message_type=file" \
    -F "file=@${file_path};filename=$(basename "$file_path")")
  assert_http "$code" "200" "send file message"
}

send_group_file_message() {
  local cookie_file="$1"
  local csrf_token="$2"
  local group_id="$3"
  local file_path="$4"
  local out_file="$5"

  local code
  code=$(curl -sS -o "$out_file" -w "%{http_code}" -c "$cookie_file" -b "$cookie_file" \
    -X POST "${BASE_URL}/api/messages/media/send_file.php" \
    -H "X-CSRF-Token: ${csrf_token}" \
    -F "group_id=${group_id}" \
    -F "message=media_envelope_${RANDOM}" \
    -F "message_for_sender=media_envelope_sender_${RANDOM}" \
    -F "message_type=file" \
    -F "file=@${file_path};filename=$(basename "$file_path")")
  assert_http "$code" "200" "send group file message"
}

create_group() {
  local cookie_file="$1"
  local csrf_token="$2"
  local out_file="$3"

  local code
  code=$(curl -sS -o "$out_file" -w "%{http_code}" -c "$cookie_file" -b "$cookie_file" \
    -X POST "${BASE_URL}/api/groups/create.php" \
    -H "Content-Type: application/json" \
    -H "X-CSRF-Token: ${csrf_token}" \
    -d '{"title":"Insights Group","description":"conversation insights test"}')

  if [[ "$code" != "200" && "$code" != "201" ]]; then
    echo "[FAIL] create group expected HTTP 200/201, got ${code}" >&2
    exit 1
  fi

  php -r '
    $json = json_decode(file_get_contents($argv[1]), true);
    if (!is_array($json) || ($json["status"] ?? "") !== "ok") {
      exit(1);
    }
    $groupId = (int) (($json["group"]["id"] ?? 0));
    if ($groupId <= 0) {
      exit(1);
    }
    echo $groupId;
  ' "$out_file"
}

assert_stats_counts() {
  local json_file="$1"
  local expected_total="$2"
  local expected_text="$3"
  local expected_file="$4"
  local label="$5"

  php -r '
    $json = json_decode(file_get_contents($argv[1]), true);
    $expTotal = (int) $argv[2];
    $expText = (int) $argv[3];
    $expFile = (int) $argv[4];
    if (!is_array($json) || ($json["status"] ?? "") !== "ok") {
      fwrite(STDERR, "[FAIL] invalid stats response\n");
      exit(1);
    }
    $stats = $json["stats"] ?? [];
    $total = (int) ($stats["total"] ?? -1);
    $text = (int) ($stats["text"] ?? -1);
    $file = (int) ($stats["file"] ?? -1);
    if ($total !== $expTotal || $text !== $expText || $file !== $expFile) {
      fwrite(STDERR, "[FAIL] stats mismatch: got total={$total}, text={$text}, file={$file}\n");
      exit(1);
    }
  ' "$json_file" "$expected_total" "$expected_text" "$expected_file"

  echo "[PASS] ${label}"
}

assert_music_page() {
  local json_file="$1"
  local expected_total="$2"
  local expected_items="$3"
  local expected_has_more="$4"
  local label="$5"

  php -r '
    $json = json_decode(file_get_contents($argv[1]), true);
    $expTotal = (int) $argv[2];
    $expItems = (int) $argv[3];
    $expHasMore = $argv[4] === "true";
    if (!is_array($json) || ($json["status"] ?? "") !== "ok") {
      fwrite(STDERR, "[FAIL] invalid music response\n");
      exit(1);
    }
    $items = $json["items"] ?? [];
    if (!is_array($items)) {
      fwrite(STDERR, "[FAIL] music items missing\n");
      exit(1);
    }
    $total = (int) ($json["total"] ?? -1);
    $hasMore = (bool) ($json["hasMore"] ?? false);
    if ($total !== $expTotal || count($items) !== $expItems || $hasMore !== $expHasMore) {
      fwrite(STDERR, "[FAIL] music page mismatch\n");
      exit(1);
    }
    if (count($items) >= 2) {
      $leftId = (int) ($items[0]["id"] ?? 0);
      $rightId = (int) ($items[1]["id"] ?? 0);
      if ($leftId <= 0 || $rightId <= 0 || $leftId < $rightId) {
        fwrite(STDERR, "[FAIL] music ordering is not descending\n");
        exit(1);
      }
    }
  ' "$json_file" "$expected_total" "$expected_items" "$expected_has_more"

  echo "[PASS] ${label}"
}

echo "Running conversation insights smoke checks against ${BASE_URL}"

login_user "$USER_A" "$PASS" "$COOKIE_A" "$INDEX_A" "User A"
login_user "$USER_B" "$PASS" "$COOKIE_B" "$INDEX_B" "User B"

code=$(curl -sS -o "$DASH_A" -w "%{http_code}" -c "$COOKIE_A" -b "$COOKIE_A" "${BASE_URL}/dashboard.php")
assert_http "$code" "200" "User A dashboard"
CSRF_A="$(extract_dashboard_csrf "$DASH_A")"

# Private chat fixtures (A <-> B): 12 text + 3 file
FIRST_PRIVATE_ID=0
for i in $(seq 1 12); do
  MID="$(send_text_message "$COOKIE_A" "$CSRF_A" "$USER_B" "insight_text_${i}" "${WORK_DIR}/send_text_${i}.json")"
  if [[ "$i" == "1" ]]; then
    FIRST_PRIVATE_ID="$MID"
  fi
done

for i in $(seq 1 3); do
  FILE_PATH="${WORK_DIR}/private_track_${i}.mp3"
  printf 'private-audio-%s' "$i" >"$FILE_PATH"
  send_file_message "$COOKIE_A" "$CSRF_A" "$USER_B" "$FILE_PATH" "${WORK_DIR}/send_file_${i}.json"
done

# Stats endpoint: private chat must include all history, not only loaded messages
code=$(curl -sS -o "${WORK_DIR}/stats_private.json" -w "%{http_code}" -c "$COOKIE_A" -b "$COOKIE_A" \
  "${BASE_URL}/api/messages/stats.php?with=${USER_B}")
assert_http "$code" "200" "stats private"
assert_stats_counts "${WORK_DIR}/stats_private.json" 15 12 3 "private stats are complete"

# Music list pagination + ordering (date desc)
code=$(curl -sS -o "${WORK_DIR}/music_private_p1.json" -w "%{http_code}" -c "$COOKIE_A" -b "$COOKIE_A" \
  "${BASE_URL}/api/messages/music_list.php?with=${USER_B}&offset=0&limit=2")
assert_http "$code" "200" "music private page 1"
assert_music_page "${WORK_DIR}/music_private_p1.json" 3 2 true "private music page 1"

code=$(curl -sS -o "${WORK_DIR}/music_private_p2.json" -w "%{http_code}" -c "$COOKIE_A" -b "$COOKIE_A" \
  "${BASE_URL}/api/messages/music_list.php?with=${USER_B}&offset=2&limit=2")
assert_http "$code" "200" "music private page 2"
assert_music_page "${WORK_DIR}/music_private_p2.json" 3 1 false "private music page 2"

# Jump loading contract via target_id should include old target even with small limit
code=$(curl -sS -o "${WORK_DIR}/fetch_jump_private.json" -w "%{http_code}" -c "$COOKIE_A" -b "$COOKIE_A" \
  "${BASE_URL}/api/messages/fetch.php?with=${USER_B}&limit=5&offset=0&target_id=${FIRST_PRIVATE_ID}")
assert_http "$code" "200" "fetch jump private"
php -r '
  $json = json_decode(file_get_contents($argv[1]), true);
  $targetId = (int) $argv[2];
  if (!is_array($json) || ($json["status"] ?? "") !== "ok") {
    fwrite(STDERR, "[FAIL] invalid fetch jump response\n");
    exit(1);
  }
  $messages = $json["messages"] ?? [];
  if (!is_array($messages) || count($messages) < 12) {
    fwrite(STDERR, "[FAIL] jump fetch did not load enough history\n");
    exit(1);
  }
  $found = false;
  foreach ($messages as $m) {
    if ((int) ($m["id"] ?? 0) === $targetId) {
      $found = true;
      break;
    }
  }
  if (!$found) {
    fwrite(STDERR, "[FAIL] jump fetch missing target message\n");
    exit(1);
  }
  fwrite(STDOUT, "[PASS] jump fetch includes target history\n");
' "${WORK_DIR}/fetch_jump_private.json" "$FIRST_PRIVATE_ID"

# Saved messages fixtures (A -> A): 2 text + 2 file
for i in $(seq 1 2); do
  send_text_message "$COOKIE_A" "$CSRF_A" "$USER_A" "saved_text_${i}" "${WORK_DIR}/send_saved_text_${i}.json" >/dev/null
done

for i in $(seq 1 2); do
  FILE_PATH="${WORK_DIR}/saved_track_${i}.mp3"
  printf 'saved-audio-%s' "$i" >"$FILE_PATH"
  send_file_message "$COOKIE_A" "$CSRF_A" "$USER_A" "$FILE_PATH" "${WORK_DIR}/send_saved_file_${i}.json"
done

code=$(curl -sS -o "${WORK_DIR}/stats_saved.json" -w "%{http_code}" -c "$COOKIE_A" -b "$COOKIE_A" \
  "${BASE_URL}/api/messages/stats.php?with=${USER_A}")
assert_http "$code" "200" "stats saved"
assert_stats_counts "${WORK_DIR}/stats_saved.json" 4 2 2 "saved stats are complete"

code=$(curl -sS -o "${WORK_DIR}/music_saved.json" -w "%{http_code}" -c "$COOKIE_A" -b "$COOKIE_A" \
  "${BASE_URL}/api/messages/music_list.php?with=${USER_A}&offset=0&limit=10")
assert_http "$code" "200" "music saved"
assert_music_page "${WORK_DIR}/music_saved.json" 2 2 false "saved music list"

# Group fixtures (A owner): 4 text + 3 file
GROUP_ID="$(create_group "$COOKIE_A" "$CSRF_A" "${WORK_DIR}/group_create.json")"
for i in $(seq 1 4); do
  send_group_text_message "$COOKIE_A" "$CSRF_A" "$GROUP_ID" "group_text_${i}" "${WORK_DIR}/send_group_text_${i}.json"
done

for i in $(seq 1 3); do
  FILE_PATH="${WORK_DIR}/group_track_${i}.mp3"
  printf 'group-audio-%s' "$i" >"$FILE_PATH"
  send_group_file_message "$COOKIE_A" "$CSRF_A" "$GROUP_ID" "$FILE_PATH" "${WORK_DIR}/send_group_file_${i}.json"
done

code=$(curl -sS -o "${WORK_DIR}/stats_group.json" -w "%{http_code}" -c "$COOKIE_A" -b "$COOKIE_A" \
  "${BASE_URL}/api/messages/stats.php?group_id=${GROUP_ID}")
assert_http "$code" "200" "stats group"
assert_stats_counts "${WORK_DIR}/stats_group.json" 7 4 3 "group stats are complete"

code=$(curl -sS -o "${WORK_DIR}/music_group_p1.json" -w "%{http_code}" -c "$COOKIE_A" -b "$COOKIE_A" \
  "${BASE_URL}/api/messages/music_list.php?group_id=${GROUP_ID}&offset=0&limit=2")
assert_http "$code" "200" "music group page 1"
assert_music_page "${WORK_DIR}/music_group_p1.json" 3 2 true "group music page 1"

code=$(curl -sS -o "${WORK_DIR}/music_group_p2.json" -w "%{http_code}" -c "$COOKIE_A" -b "$COOKIE_A" \
  "${BASE_URL}/api/messages/music_list.php?group_id=${GROUP_ID}&offset=2&limit=2")
assert_http "$code" "200" "music group page 2"
assert_music_page "${WORK_DIR}/music_group_p2.json" 3 1 false "group music page 2"

echo "All conversation insights smoke checks passed"
