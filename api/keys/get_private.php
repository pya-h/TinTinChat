<?php
session_start();
require_once __DIR__ . '/../../includes/db.php';
require_once __DIR__ . '/../../includes/api_helpers.php';

apiRequireMethod('GET');
$userId = apiRequireAuth();
session_write_close();

$stmt = $pdo->prepare('SELECT private_key FROM users WHERE id = ?');
$stmt->execute([$userId]);
$user = $stmt->fetch();

if (!$user) {
	apiError('USER_NOT_FOUND', 'User not found', 404);
}

apiSuccess(['privateKeyPem' => $user['private_key']]);
