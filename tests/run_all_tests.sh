#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BASE_URL="${1:-http://localhost:8080}"
AUTO_SERVER="${2:-auto}"
SERVER_PID=""
SERVER_PID_FILE="/tmp/tintin_test_server.pid"
ENV_FILE="${ROOT_DIR}/.env.test"

# ── Colors ───────────────────────────────────────────────────
if [[ -t 1 ]] && [[ -z "${NO_COLOR:-}" ]]; then
  C_GREEN='\033[32m'
  C_RED='\033[31m'
  C_YELLOW='\033[33m'
  C_CYAN='\033[36m'
  C_BOLD='\033[1m'
  C_DIM='\033[2m'
  C_RESET='\033[0m'
else
  C_GREEN='' C_RED='' C_YELLOW='' C_CYAN='' C_BOLD='' C_DIM='' C_RESET=''
fi

# ── Env setup ────────────────────────────────────────────────
if [[ ! -f "${ENV_FILE}" ]]; then
  echo -e "${C_RED}[FAIL] Missing .env.test — copy .env and set DB_NAME to a test database${C_RESET}" >&2
  exit 1
fi

set -a
source "${ENV_FILE}"
set +a

# ── Server management ────────────────────────────────────────
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
    echo -e "${C_DIM}[INFO] Reusing existing server at ${BASE_URL}${C_RESET}"
    return
  fi

  if [[ "${AUTO_SERVER}" == "reuse" ]]; then
    echo -e "${C_RED}[FAIL] Server not reachable at ${BASE_URL} and AUTO_SERVER=reuse${C_RESET}" >&2
    exit 1
  fi

  echo -e "${C_DIM}[INFO] Starting local PHP server for tests (DB: ${DB_NAME})${C_RESET}"
  (
    cd "${ROOT_DIR}"
    php -d upload_max_filesize=110M -d post_max_size=120M -S localhost:8080 >/tmp/tintin_test_server.log 2>&1
  ) &
  SERVER_PID=$!
  echo "${SERVER_PID}" >"${SERVER_PID_FILE}"

  for _ in {1..20}; do
    if is_server_up; then
      echo -e "${C_GREEN}[PASS] Test server is up${C_RESET}"
      return
    fi
    sleep 0.5
  done

  echo -e "${C_RED}[FAIL] Unable to start test server${C_RESET}" >&2
  exit 1
}

# ── Test tracking ────────────────────────────────────────────
STEP_TOTAL=0
STEP_PASSED=0
STEP_FAILED=0
FAILED_STEPS=()
START_TIME=$(date +%s)

run_step() {
  local label="$1"
  shift

  STEP_TOTAL=$((STEP_TOTAL + 1))
  echo -e "\n${C_BOLD}${C_CYAN}=== ${label} ===${C_RESET}"

  local step_start
  step_start=$(date +%s)

  if "$@" 2>&1; then
    local step_elapsed=$(( $(date +%s) - step_start ))
    STEP_PASSED=$((STEP_PASSED + 1))
    echo -e "${C_GREEN}[PASS]${C_RESET} ${label} ${C_DIM}(${step_elapsed}s)${C_RESET}"
  else
    local step_elapsed=$(( $(date +%s) - step_start ))
    STEP_FAILED=$((STEP_FAILED + 1))
    FAILED_STEPS+=("${label}")
    echo -e "${C_RED}[FAIL]${C_RESET} ${label} ${C_DIM}(${step_elapsed}s)${C_RESET}"
  fi
}

# ── Run tests ────────────────────────────────────────────────
cd "${ROOT_DIR}"

run_step "Environment setup" bash tests/setup_test_env.sh "${BASE_URL}"
start_server_if_needed

run_step "PHP lint (api/includes)" bash -lc "find api includes -name '*.php' -print0 | xargs -0 -n1 php -l >/dev/null"
run_step "Unit tests" php tests/unit/run.php
run_step "E2E: API guard" bash tests/e2e/api_guard_smoke.sh "${BASE_URL}"
run_step "E2E: Session & CSRF" bash tests/e2e/session_smoke.sh "${BASE_URL}"
run_step "E2E: Authenticated chat" bash tests/e2e/authenticated_chat_smoke.sh "${BASE_URL}"
run_step "E2E: Message edit" bash tests/e2e/message_edit_smoke.sh "${BASE_URL}"
run_step "E2E: Admin sticker visibility" bash tests/e2e/admin_sticker_visibility_smoke.sh "${BASE_URL}"
run_step "E2E: Profile settings" bash tests/e2e/profile_settings_smoke.sh "${BASE_URL}"
run_step "E2E: Profile settings (edge cases)" bash tests/e2e/profile_settings_edge_smoke.sh "${BASE_URL}"
run_step "E2E: Group chat" bash tests/e2e/group_chat_smoke.sh "${BASE_URL}"
run_step "E2E: Group authorization" bash tests/e2e/group_authorization_smoke.sh "${BASE_URL}"
run_step "E2E: Block user" bash tests/e2e/block_user_smoke.sh "${BASE_URL}"
run_step "E2E: Ideas/feedback" bash tests/e2e/ideas_smoke.sh "${BASE_URL}"
run_step "E2E: User search" bash tests/e2e/search_smoke.sh "${BASE_URL}"
run_step "E2E: Conversation insights" bash tests/e2e/conversation_insights_smoke.sh "${BASE_URL}"

# ── Summary ──────────────────────────────────────────────────
ELAPSED=$(( $(date +%s) - START_TIME ))
MINUTES=$((ELAPSED / 60))
SECONDS_R=$((ELAPSED % 60))

echo ""
echo -e "${C_BOLD}$(printf '═%.0s' {1..60})${C_RESET}"
echo -e "${C_BOLD}  Test Suite Results${C_RESET}"
echo -e "${C_BOLD}$(printf '═%.0s' {1..60})${C_RESET}"
echo ""
echo -e "  ${C_BOLD}Total:${C_RESET}    ${STEP_TOTAL} test suites"
echo -e "  ${C_GREEN}${C_BOLD}Passed:${C_RESET}   ${STEP_PASSED}"

if [[ ${STEP_FAILED} -gt 0 ]]; then
  echo -e "  ${C_RED}${C_BOLD}Failed:${C_RESET}   ${STEP_FAILED}"
fi

echo -e "  ${C_DIM}Time:${C_RESET}     ${MINUTES}m ${SECONDS_R}s"

if [[ ${STEP_FAILED} -gt 0 ]]; then
  echo ""
  echo -e "  ${C_RED}${C_BOLD}Failed suites:${C_RESET}"
  for name in "${FAILED_STEPS[@]}"; do
    echo -e "    ${C_RED}✗ ${name}${C_RESET}"
  done
  echo ""
  echo -e "  ${C_RED}${C_BOLD}${STEP_FAILED} of ${STEP_TOTAL} test suites failed ✗${C_RESET}"
  echo ""
  exit 1
else
  echo ""
  echo -e "  ${C_GREEN}${C_BOLD}All ${STEP_PASSED} test suites passed ✓${C_RESET}"
  echo ""
fi
