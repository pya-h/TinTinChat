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
    clearPossibleLoginSession();
    $_SESSION = [];
    session_destroy();
    echo <<<_END
        <script>
            localStorage.removeItem('ident');
            window.location.href = '../index.php';
        </script>
    _END;
}