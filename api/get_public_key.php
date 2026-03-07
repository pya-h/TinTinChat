<?php
session_start();
require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/api_helpers.php';

apiRequireMethod('GET');
apiRequireAuth();

$username = $_GET['username'] ?? '';
if (!$username) {
    apiError('MISSING_USERNAME', 'Missing username', 400);
}

$stmt = $pdo->prepare('SELECT public_key FROM users WHERE username = ?');
$stmt->execute([$username]);
$user = $stmt->fetch();

if (!$user) {
    apiError('USER_NOT_FOUND', 'User not found', 404);
}

apiSuccess(['publicKey' => $user['public_key']]);
