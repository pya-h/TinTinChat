#!/usr/bin/env bash
set -euo pipefail

PID_FILE="/tmp/tintin_test_server.pid"
PORT=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --pid-file)
      PID_FILE="$2"
      shift 2
      ;;
    --port)
      PORT="$2"
      shift 2
      ;;
    *)
      echo "Unknown argument: $1" >&2
      echo "Usage: $0 [--pid-file <path>] [--port <port>]" >&2
      exit 1
      ;;
  esac
done

killed_any=0

kill_pid() {
  local pid="$1"
  if [[ -n "${pid}" ]] && kill -0 "${pid}" >/dev/null 2>&1; then
    kill "${pid}" >/dev/null 2>&1 || true
    wait "${pid}" 2>/dev/null || true
    killed_any=1
  fi
}

if [[ -f "${PID_FILE}" ]]; then
  pid_from_file="$(cat "${PID_FILE}" 2>/dev/null || true)"
  kill_pid "${pid_from_file}"
  rm -f "${PID_FILE}" || true
fi

if [[ -n "${PORT}" ]] && command -v lsof >/dev/null 2>&1; then
  while IFS= read -r pid; do
    [[ -z "${pid}" ]] && continue
    if ps -p "${pid}" -o command= 2>/dev/null | grep -q "php.* -S "; then
      kill_pid "${pid}"
    fi
  done < <(lsof -ti tcp:"${PORT}" 2>/dev/null || true)
fi

if [[ "${killed_any}" -eq 1 ]]; then
  echo "[PASS] Test server stopped"
else
  echo "[INFO] No managed test server process found"
fi
