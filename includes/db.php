<?php
function loadEnv(string $path)
{
    if (!file_exists($path))
        return;

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0)
            continue;
        [$name, $value] = array_map('trim', explode('=', $line, 2));
        if (!isset($_ENV[$name])) {
            $value = trim($value, '"\'');
            $_ENV[$name] = $value;
        }
    }
}
$pdo = null;

function loadPDO() {
    loadEnv(__DIR__ . '/../.env');
    global $pdo;
    $host = $_ENV['DB_HOST'] ?? 'localhost';
    $db = $_ENV['DB_NAME'] ?? 'minichat';
    $user = $_ENV['DB_USER'] ?? 'root';
    $pass = $_ENV['DB_PASS'] ?? '';
    try {
        $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $pdo;
    } catch (PDOException $e) {
        die('DB connection failed: ' . $e->getMessage());
    }
}

function logText($text) {
    $log_file = fopen("../log.fux", "a");
    fwrite($log_file, json_encode($text) . "\n");
    fclose($log_file);
}

function updateLoginSession($user_id, $new_ident) {
    global $pdo;
    $stmt = $pdo->prepare('UPDATE users SET last_login=?, ident=? WHERE id=?');
    $stmt->execute([date('Y-m-d H:i:s'), $new_ident, $user_id]);
}

function clearPossibleLoginSession() {
    global $pdo;
    if(isset($_SESSION['user_id']) && $_SESSION['user_id']) {
        $stmt = $pdo->prepare('UPDATE users SET ident=NULL WHERE id=?');
        $stmt->execute([$_SESSION['user_id']]);
    }
}

loadPDO();