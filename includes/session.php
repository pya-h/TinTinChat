<?php
function sanitizeString($str) {
    return stripslashes(htmlentities(strip_tags($str)));
}

function configSession()
{
    $isSecure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'secure' => $isSecure,
        'httponly' => true,
        'samesite' => 'Strict',
    ]);
    session_start();

    // Security headers
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: DENY');
    header('X-XSS-Protection: 1; mode=block');
    header('Referrer-Policy: strict-origin-when-cross-origin');

    if(isset($_SESSION['user_id'])) {
        return;
    }
    echo <<<_END
        <script>
            const ident = localStorage.getItem('ident');
            if (ident) {
                fetch(
                    'api/get_user_by_ident.php?ident=' + encodeURIComponent(ident)
                ).then((res) => {
                    if(res.ok) {
                        res.json().then(() => window.location.reload());
                    }
                });
            }
        </script>
        _END;
}

function generateCsrfToken() {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function verifyCsrfToken($token) {
    return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}

function setSessionUser($user) {
    try {
        session_regenerate_id(true);
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        $ident = bin2hex(random_bytes(32)) . '.' . time();
        $_SESSION['ident'] = $ident;
        return $ident;
    } catch(Exception) {}
    return null;
}