<?php
if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/crypto_helper.php';

function getUserByUsername($username)
{
    global $pdo;
    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
    $stmt->execute([$username]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

function createUser($username, $password)
{
    global $pdo;
    $hash = password_hash($password, PASSWORD_DEFAULT);

    // generate RSA key pair for new user
    list($publicKeyBase64, $privateKeyBase64) = generate_rsa_keypair();

    $stmt = $pdo->prepare("INSERT INTO users (username, password_hash, public_key, private_key) VALUES (?, ?, ?, ?)");
    $stmt->execute([
        $username,
        $hash,
        $publicKeyBase64,
        $privateKeyBase64,
    ]);

    return $pdo->lastInsertId();
}

function logout(): void {
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }
    $scriptName = (string)($_SERVER['SCRIPT_NAME'] ?? '');
    $basePath = preg_replace('#/api(?:/auth)?/logout\.php$#', '', $scriptName);
    if (!is_string($basePath)) {
        $basePath = '';
    }
    $basePath = rtrim($basePath, '/');
    $redirectTo = ($basePath === '' ? '' : $basePath) . '/index.php';

    clearPossibleLoginSession();
    $_SESSION = [];
    session_destroy();
    echo <<<_END
        <script>
            localStorage.removeItem('ident');
            window.location.href = '{$redirectTo}';
        </script>
    _END;
}