<?php
session_start();
require_once __DIR__ . '/../../../tintin-core/includes/db.php';
require_once __DIR__ . '/../../../tintin-core/includes/api_helpers.php';

apiRequireMethod('POST');
$userId = apiRequireAuth();
apiRequireCsrf();

$data = apiGetJsonBody();
if (empty($data['publicKey'])) {
	apiError('MISSING_PUBLIC_KEY', 'No public key provided', 400);
}

$publicKey = is_array($data['publicKey'])
	? json_encode($data['publicKey'])
	: trim((string) $data['publicKey']);

if (!$publicKey) {
	apiError('INVALID_PUBLIC_KEY', 'Invalid public key payload', 400);
}

try {
	$stmt = $pdo->prepare('UPDATE users SET public_key = ? WHERE id = ?');
	$stmt->execute([$publicKey, $userId]);
	apiSuccess();
} catch (Exception $e) {
	apiError('SAVE_FAILED', 'Failed to save key', 500);
}
