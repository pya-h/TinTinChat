<?php
if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/crypto_helper.php';

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
    $safeRedirect = htmlspecialchars(addslashes($redirectTo), ENT_QUOTES, 'UTF-8');

    // Remove session record from user_sessions table
    if (!empty($_SESSION['ident'])) {
        deleteUserSessionByToken($_SESSION['ident']);
    }
    clearPossibleLoginSession();
    $_SESSION = [];
    session_destroy();
    echo <<<_END
        <script>
            localStorage.removeItem('ident');
            window.location.href = '{$safeRedirect}';
        </script>
    _END;
}