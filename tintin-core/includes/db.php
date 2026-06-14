<?php
function envGet(string $name, string $default = ''): string
{
    // Check $_ENV first (populated when variables_order includes E),
    // then getenv() (always works with shell-exported vars),
    // then fall back to default.
    if (isset($_ENV[$name]) && $_ENV[$name] !== '') {
        return $_ENV[$name];
    }
    $val = getenv($name);
    return ($val !== false && $val !== '') ? $val : $default;
}

function loadEnv(string $path)
{
    if (!file_exists($path))
        return;

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0)
            continue;
        if (strpos($line, '=') === false)
            continue;
        [$name, $value] = array_map('trim', explode('=', $line, 2));
        if ($name === '')
            continue;
        $existing = envGet($name);
        if ($existing !== '') {
            // Shell env already has it — mirror into $_ENV so legacy $_ENV reads work
            $_ENV[$name] = $existing;
        } else {
            // Set from file
            $value = trim($value, '"\'');
            $_ENV[$name] = $value;
            putenv("{$name}={$value}");
        }
    }
}
$pdo = null;

function loadPDO() {
    loadEnv(__DIR__ . '/../.env');
    global $pdo;
    $host = envGet('DB_HOST', 'localhost');
    $db = envGet('DB_NAME', 'minichat');
    $user = envGet('DB_USER', 'root');
    $pass = envGet('DB_PASS', '');
    try {
        $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $pdo;
    } catch (PDOException $e) {
        error_log('DB connection failed: ' . $e->getMessage());
        die('Database connection error. Please try again later.');
    }
}

function updateLoginSession(int $user_id, string $new_ident) {
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

function createUserSession(int $userId, string $sessionToken): void {
    global $pdo;
    $ip = $_SERVER['REMOTE_ADDR'] ?? null;
    $ua = $_SERVER['HTTP_USER_AGENT'] ?? null;
    $stmt = $pdo->prepare(
        'INSERT INTO user_sessions (user_id, session_token, ip_address, user_agent, is_current)
         VALUES (?, ?, ?, ?, 0)'
    );
    $stmt->execute([$userId, $sessionToken, $ip, $ua]);
}

function deleteUserSession(int $sessionId, int $userId): bool {
    global $pdo;
    $stmt = $pdo->prepare('DELETE FROM user_sessions WHERE id = ? AND user_id = ?');
    $stmt->execute([$sessionId, $userId]);
    return $stmt->rowCount() > 0;
}

function deleteUserSessionByToken(string $token): void {
    global $pdo;
    $stmt = $pdo->prepare('DELETE FROM user_sessions WHERE session_token = ?');
    $stmt->execute([$token]);
}

function listUserSessions(int $userId): array {
    global $pdo;
    $stmt = $pdo->prepare(
        'SELECT id, session_token, ip_address, user_agent, created_at, last_active_at
         FROM user_sessions WHERE user_id = ? ORDER BY last_active_at DESC LIMIT 50'
    );
    $stmt->execute([$userId]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function touchUserSession(string $token): void {
    global $pdo;
    $stmt = $pdo->prepare('UPDATE user_sessions SET last_active_at = NOW() WHERE session_token = ?');
    $stmt->execute([$token]);
}

loadPDO();