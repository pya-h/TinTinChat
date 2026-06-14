#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-http://localhost:8080}"

check_endpoint() {
  local method="$1"
  local path="$2"
  local expected_code="$3"

  local code
  if [[ "$method" == "GET" ]]; then
    code=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}${path}")
  else
    code=$(curl -s -o /dev/null -w "%{http_code}" -X "$method" "${BASE_URL}${path}")
  fi

  if [[ "$code" != "$expected_code" ]]; then
    echo "[FAIL] ${method} ${path} -> expected ${expected_code}, got ${code}"
    return 1
  fi

  echo "[PASS] ${method} ${path} -> ${code}"
}

echo "Running API guard smoke checks against ${BASE_URL}"
check_endpoint GET "/api/chats/fetch.php" "401"
check_endpoint GET "/api/messages/fetch.php?with=testuser" "401"
check_endpoint POST "/api/messages/send_text.php" "401"
check_endpoint GET "/api/messages/stickers/fetch.php" "401"

echo "All API guard smoke checks passed"
