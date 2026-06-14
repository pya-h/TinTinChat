<?php
session_start();

require_once __DIR__ . '/../../../../tintin-core/includes/db.php';
require_once __DIR__ . '/../../../../tintin-core/includes/api_helpers.php';

apiRequireMethod('POST');
$userId = apiRequireAuth();
apiRequireCsrf();
apiRequireAdminUser($pdo, $userId);

$columns = apiGetTableColumns($pdo, 'stickers');
if (empty($columns) || !isset($columns['is_admin_only'])) {
    apiError('STICKER_SCHEMA_OUTDATED', 'Stickers schema is missing or outdated. Run migration 18_add_sticker_admin_only_support.sql.', 500);
}

$body = apiGetJsonBody();
$stickerId = isset($body['sticker_id']) ? (int) $body['sticker_id'] : 0;
$isAdminOnly = !empty($body['is_admin_only']) ? 1 : 0;

if ($stickerId <= 0) {
    apiError('INVALID_STICKER_ID', 'Invalid sticker id.', 400);
}

$existsStmt = $pdo->prepare('SELECT id FROM stickers WHERE id = ? LIMIT 1');
$existsStmt->execute([$stickerId]);
if (!$existsStmt->fetch(PDO::FETCH_ASSOC)) {
    apiError('STICKER_NOT_FOUND', 'Sticker not found.', 404);
}

$updateStmt = $pdo->prepare('UPDATE stickers SET is_admin_only = ? WHERE id = ? LIMIT 1');
$updateStmt->execute([$isAdminOnly, $stickerId]);

apiSuccess([
    'sticker_id' => $stickerId,
    'is_admin_only' => (bool) $isAdminOnly,
]);
