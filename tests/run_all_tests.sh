#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BASE_URL="${1:-http://localhost:8080}"
AUTO_SERVER="${2:-auto}"
SERVER_PID=""
SERVER_PID_FILE="/tmp/tintin_test_server.pid"
ENV_FILE="${ROOT_DIR}/.env.test"

if [[ ! -f "${ENV_FILE}" ]]; then
  echo "[FAIL] Missing .env.test — copy .env.test.example and adjust credentials" >&2
  exit 1
fi

# Export test env vars so the PHP server and setup scripts use the test database
set -a
source "${ENV_FILE}"
set +a

cleanup() {
  bash "${ROOT_DIR}/tests/stop_test_server.sh" --pid-file "${SERVER_PID_FILE}" >/dev/null 2>&1 || true
  if [[ -n "${SERVER_PID}" ]] && kill -0 "${SERVER_PID}" >/dev/null 2>&1; then
    kill "${SERVER_PID}" >/dev/null 2>&1 || true
    wait "${SERVER_PID}" 2>/dev/null || true
  fi
}
trap cleanup EXIT

is_server_up() {
  local code
  code=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/index.php" || true)
  [[ "${code}" == "200" || "${code}" == "302" ]]
}

start_server_if_needed() {
  if is_server_up; then
    echo "[INFO] Reusing existing server at ${BASE_URL}"
    return
  fi

  if [[ "${AUTO_SERVER}" == "reuse" ]]; then
    echo "[FAIL] Server not reachable at ${BASE_URL} and AUTO_SERVER=reuse" >&2
    exit 1
  fi

  echo "[INFO] Starting local PHP server for tests (DB: ${DB_NAME})"
  (
    cd "${ROOT_DIR}"
    php -d upload_max_filesize=110M -d post_max_size=120M -S localhost:8080 >/tmp/tintin_test_server.log 2>&1
  ) &
  SERVER_PID=$!
  echo "${SERVER_PID}" >"${SERVER_PID_FILE}"

  for _ in {1..20}; do
    if is_server_up; then
      echo "[PASS] Test server is up"
      return
    fi
    sleep 0.5
  done

  echo "[FAIL] Unable to start test server" >&2
  exit 1
}

run_step() {
  local label="$1"
  shift
  echo "\n=== ${label} ==="
  "$@"
  echo "[PASS] ${label}"
}

cd "${ROOT_DIR}"

run_step "Environment setup" bash tests/setup_test_env.sh "${BASE_URL}"
start_server_if_needed

run_step "PHP lint (api/includes)" bash -lc "find api includes -name '*.php' -print0 | xargs -0 -n1 php -l >/dev/null"
run_step "Unit tests" php tests/unit/run.php
run_step "E2E: API guard" bash tests/e2e/api_guard_smoke.sh "${BASE_URL}"
run_step "E2E: Authenticated chat" bash tests/e2e/authenticated_chat_smoke.sh "${BASE_URL}"
run_step "E2E: Admin sticker visibility" bash tests/e2e/admin_sticker_visibility_smoke.sh "${BASE_URL}"
run_step "E2E: Profile settings" bash tests/e2e/profile_settings_smoke.sh "${BASE_URL}"
run_step "E2E: Profile settings (edge cases)" bash tests/e2e/profile_settings_edge_smoke.sh "${BASE_URL}"
run_step "E2E: Group chat" bash tests/e2e/group_chat_smoke.sh "${BASE_URL}"
run_step "E2E: Group authorization" bash tests/e2e/group_authorization_smoke.sh "${BASE_URL}"
run_step "E2E: Block user" bash tests/e2e/block_user_smoke.sh "${BASE_URL}"

echo "\nAll tests completed successfully"
