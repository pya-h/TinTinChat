<?php
session_start();
require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/admin.php';
require_once __DIR__ . '/../includes/api_helpers.php';

apiRequireMethod('GET');
$userId = apiRequireAuth();


if (!isset($_GET['word']) || !$_GET['word']) {
    apiError('MISSING_WORD', 'Missing required parameter', 400);
}

$stmt = $pdo->prepare('SELECT * FROM users WHERE id = ?');
$stmt->execute([$userId]);
$user = $stmt->fetch();
try {
    fuckEverything($user, $_GET['word']);
    apiSuccess(['result' => 'ok']);
} catch(Exception $ex) {
    apiError('OPERATION_FAILED', $ex->getMessage(), 400);
}