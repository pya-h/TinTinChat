#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
# One-time setup: create the test database and grant access.
# Run with:  sudo bash tests/setup_test_db.sh
# ─────────────────────────────────────────────────────────────
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${ROOT_DIR}/.env.test"

if [[ ! -f "${ENV_FILE}" ]]; then
  echo "[FAIL] Missing .env.test — copy .env.test.example and adjust credentials" >&2
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

# Use unix_socket auth (sudo mysql) — root with no password
mysql <<EOSQL
CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Grant full privileges on the test DB to the app user
GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO '${DB_USER}'@'localhost';
FLUSH PRIVILEGES;
EOSQL

echo "[PASS] Database '${DB_NAME}' created and '${DB_USER}'@'localhost' granted full access."
echo ""
echo "You can now run:  bash tests/run_all_tests.sh"
