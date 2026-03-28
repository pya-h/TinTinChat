#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
# One-time setup: create the test database and grant access.
#
# Usage:
#   sudo bash tests/setup_test_db.sh          # uses unix socket auth
#   bash tests/setup_test_db.sh --no-sudo     # tries current mysql user
# ─────────────────────────────────────────────────────────────
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${ROOT_DIR}/.env.test"
USE_SUDO=true

while [[ $# -gt 0 ]]; do
  case "$1" in
    --no-sudo) USE_SUDO=false; shift ;;
    *) echo "Unknown option: $1" >&2; exit 1 ;;
  esac
done

if [[ ! -f "${ENV_FILE}" ]]; then
  echo "[FAIL] Missing .env.test — copy from .env and set DB_NAME to a test database" >&2
  exit 1
fi

# Source test env to read DB_NAME / DB_USER / DB_PASS
set -a
source "${ENV_FILE}"
set +a

DB_NAME="${DB_NAME:-minichatdb_test}"
DB_USER="${DB_USER:-paya}"
DB_PASS="${DB_PASS:-}"

echo "Setting up test database: ${DB_NAME} for user: ${DB_USER}"

SQL_COMMANDS="
CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO '${DB_USER}'@'%';
GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO '${DB_USER}'@'localhost';
FLUSH PRIVILEGES;
"

if [[ "${USE_SUDO}" == "true" ]]; then
  echo "[INFO] Using sudo mysql (unix socket auth)"
  sudo mysql <<< "${SQL_COMMANDS}"
else
  echo "[INFO] Using current mysql user"
  mysql <<< "${SQL_COMMANDS}"
fi

echo ""
echo "[PASS] Database '${DB_NAME}' created and '${DB_USER}' granted full access."
echo ""
echo "You can now run:  bash tests/run_all_tests.sh"
