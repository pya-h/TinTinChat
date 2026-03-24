#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BASE_URL="${1:-http://localhost:8080}"
ENV_FILE="${ROOT_DIR}/.env.test"

if [[ ! -f "${ENV_FILE}" ]]; then
  echo "[FAIL] Missing .env.test — copy .env.test.example and adjust credentials" >&2
  exit 1
fi

# Export test env vars so the PHP process (and the test server) use the test database
set -a
source "${ENV_FILE}"
set +a

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "[FAIL] Missing required command: $1" >&2
    exit 1
  }
}

echo "Preparing TinTinChat test environment (DB: ${DB_NAME})"
require_cmd php
require_cmd curl
require_cmd bash

mkdir -p "${ROOT_DIR}/uploads/avatars" \
         "${ROOT_DIR}/uploads/images" \
         "${ROOT_DIR}/uploads/files" \
         "${ROOT_DIR}/uploads/stickers" \
         "${ROOT_DIR}/uploads/voice_messages"

echo "[PASS] Upload directories are present"

# Create test database if it doesn't exist, then run full schema + migrations
php -r '
$host = $_ENV["DB_HOST"] ?? "localhost";
$db   = $_ENV["DB_NAME"] ?? "minichatdb_test";
$user = $_ENV["DB_USER"] ?? "test";
$pass = $_ENV["DB_PASS"] ?? "test";

$pdo = new PDO("mysql:host={$host};charset=utf8mb4", $user, $pass);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$pdo->exec("CREATE DATABASE IF NOT EXISTS `{$db}`");
$pdo->exec("USE `{$db}`");
fwrite(STDOUT, "[PASS] Test database ensured: {$db}\n");

$schemaFile = $argv[1] . "/migrations/XX_schema.final.sql";
$schemaSql  = file_get_contents($schemaFile);
if ($schemaSql === false || trim($schemaSql) === "") {
    fwrite(STDERR, "[FAIL] Unable to read schema file\n");
    exit(1);
}

foreach (explode(";", $schemaSql) as $stmt) {
    $stmt = trim($stmt);
    if ($stmt === "") continue;
    try {
        $pdo->exec($stmt);
    } catch (PDOException $e) {
        $code = (string) ($e->errorInfo[1] ?? "");
        if (!in_array($code, ["1060", "1061", "1050"], true)) {
            throw $e;
        }
    }
}
fwrite(STDOUT, "[PASS] Base schema ensured\n");

$migrationFiles = glob($argv[1] . "/migrations/[0-9]*.sql");
sort($migrationFiles);
foreach ($migrationFiles as $file) {
    $sql = file_get_contents($file);
    if ($sql === false || trim($sql) === "") continue;
    try {
        $pdo->exec($sql);
    } catch (PDOException $e) {
        $code = (string) ($e->errorInfo[1] ?? "");
        if (!in_array($code, ["1060", "1061", "1050"], true)) {
            throw $e;
        }
    }
}
fwrite(STDOUT, "[PASS] All migrations applied\n");
' "${ROOT_DIR}"

health_code=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/index.php" || true)
if [[ "${health_code}" == "200" || "${health_code}" == "302" ]]; then
  echo "[PASS] Test server reachable at ${BASE_URL}"
else
  echo "[WARN] Test server not reachable at ${BASE_URL}"
  echo "Start with: php -d upload_max_filesize=110M -d post_max_size=120M -S localhost:8080"
fi

echo "Environment check complete"
