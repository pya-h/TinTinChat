<?php
session_start();
require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/api_helpers.php';

apiRequireMethod('POST');
$userId = apiRequireAuth();

$data = apiGetJsonBody();
if (empty($data['publicKey'])) {
    apiError('MISSING_PUBLIC_KEY', 'No public key provided', 400);
}

$publicKeyJson = json_encode($data['publicKey']);

try {
    $stmt = $pdo->prepare('UPDATE users SET public_key = ? WHERE id = ?');
    $stmt->execute([$publicKeyJson, $userId]);
    apiSuccess();
} catch (Exception $e) {
    apiError('SAVE_FAILED', 'Failed to save key', 500);
}
