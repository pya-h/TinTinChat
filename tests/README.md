# TinTinChat Test Suite

## Prerequisites

- PHP 8.x with PDO MySQL
- MySQL / MariaDB
- curl
- `sudo` access (for one-time DB setup)

## Quick Start

```bash
# 1. One-time: create test database & grant privileges
sudo bash tests/setup_test_db.sh

# 2. Run all tests
bash tests/run_all_tests.sh
```

## Setup (Step by Step)

### 1. Configure `.env.test`

The file `.env.test` in the project root controls which database the tests use.
It **must** point to a separate test database (not your production one):

```ini
DB_USER=myuser
DB_PASS=password
DB_NAME=minichatdb_test      # <-- separate from production!
DB_HOST=localhost
SUPERUSER_USERNAME=paya
```

### 2. Create the Test Database

The setup script creates the database and grants your DB user full privileges on it:

```bash
sudo bash tests/setup_test_db.sh
```

This runs the equivalent of:

```sql
CREATE DATABASE IF NOT EXISTS `minichatdb_test`
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

GRANT ALL PRIVILEGES ON `minichatdb_test`.* TO 'myuser'@'%';
GRANT ALL PRIVILEGES ON `minichatdb_test`.* TO 'myuser'@'localhost';
FLUSH PRIVILEGES;
```

If you have root MySQL access without `sudo`, use:

```bash
bash tests/setup_test_db.sh --no-sudo
```

Or run the SQL manually:

```bash
sudo mysql -e "GRANT ALL PRIVILEGES ON minichatdb_test.* TO 'myuser'@'%'; FLUSH PRIVILEGES;"
```

### 3. Run the Schema & Migrations

This is done automatically by `setup_test_env.sh` (called by `run_all_tests.sh`).
It reads `migrations/XX_schema.final.sql` and all numbered migration files,
applying them idempotently (duplicate column/table/index errors are ignored).

## Running Tests

### Full Suite

```bash
bash tests/run_all_tests.sh
```

This will:
1. Source `.env.test` and export the variables
2. Run environment setup (schema + migrations)
3. Start a local PHP test server on port 8080 (if not already running)
4. Run PHP lint checks on `api/` and `includes/`
5. Run all unit tests
6. Run all E2E smoke tests
7. Print a colored summary with pass/fail statistics

### Custom Server URL

```bash
bash tests/run_all_tests.sh http://localhost:9090
```

### Reuse Existing Server

If you already have a dev server running:

```bash
bash tests/run_all_tests.sh http://localhost:8080 reuse
```

### Unit Tests Only

```bash
php tests/unit/run.php
```

### Individual E2E Test

```bash
bash tests/e2e/authenticated_chat_smoke.sh http://localhost:8080
```

## Test Structure

```
tests/
  README.md                 # This file
  run_all_tests.sh          # Main test runner (entry point)
  setup_test_db.sh          # One-time DB + privilege setup
  setup_test_env.sh         # Schema/migration setup (auto-run)
  stop_test_server.sh       # Cleanup utility
  unit/
    run.php                 # Unit test runner
    api_helpers_test.php    # Upload error messages, username validation
    constants_test.php      # Constants integrity checks
    env_loader_test.php     # envGet() and loadEnv() behavior
    group_crypto_helpers_test.php  # RSA encryption roundtrips
    group_helpers_test.php  # Group ID parsing, tokens, links
  e2e/
    api_guard_smoke.sh              # Auth guard on protected endpoints
    authenticated_chat_smoke.sh     # Full DM + reaction + delete + sticker flow
    admin_sticker_visibility_smoke.sh  # Admin-only sticker access control
    profile_settings_smoke.sh       # Username/password update
    profile_settings_edge_smoke.sh  # Error codes for invalid profile updates
    group_chat_smoke.sh             # Group create/join/message/leave
    group_authorization_smoke.sh    # Non-member access denied
    block_user_smoke.sh             # Block/unblock message enforcement
    message_edit_smoke.sh           # Message edit + edit window enforcement
    ideas_smoke.sh                  # Ideas CRUD + voting
    search_smoke.sh                 # User search API
    session_smoke.sh                # Session & CSRF validation
```

## How Tests Work

### Unit Tests
PHP files in `tests/unit/` return an associative array of `name => callable`.
Each callable either completes (pass) or throws an exception (fail).

### E2E Smoke Tests
Bash scripts that use `curl` to hit the API endpoints against a running server.
Each test creates its own random usernames to avoid collisions.
Tests auto-register users (the login endpoint creates accounts if they don't exist).

## Troubleshooting

### "Access denied for user 'test'@'localhost'"
Your PHP has `variables_order=GPCS` (no `E`), so `$_ENV` is not populated
from shell environment variables. This was fixed — `getenv()` is now used instead.
Make sure you're on the latest code.

### "REFERENCES command denied"
Your DB user doesn't have full privileges on the test database.
Re-run `sudo bash tests/setup_test_db.sh`.

### Tests pass but shouldn't / Tests seem to skip checks
Unit tests throw exceptions on failure. If a test function completes without
throwing, it passes. Review assertions to ensure they actually check conditions.
