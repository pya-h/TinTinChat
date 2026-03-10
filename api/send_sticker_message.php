<?php
session_start();

require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/api_helpers.php';
require_once __DIR__ . '/../includes/group_helpers.php';

apiRequireMethod('POST');
$userId = apiRequireAuth();
apiRequireCsrf();

$groupId = groupParseId($_POST['group_id'] ?? null);
$target = $groupId > 0 ? '' : apiNormalizeUsername($_POST['target'] ?? '', 'INVALID_TARGET_USERNAME');
$stickerId = isset($_POST['sticker_id']) ? (int) $_POST['sticker_id'] : 0;

if ($stickerId <= 0) {
    apiError('INVALID_STICKER_ID', 'Invalid sticker id.', 400);
}

$stickerStmt = $pdo->prepare('SELECT id FROM stickers WHERE id = ? AND is_active = 1 LIMIT 1');
$stickerStmt->execute([$stickerId]);
$sticker = $stickerStmt->fetch(PDO::FETCH_ASSOC);
if (!$sticker) {
    apiError('STICKER_NOT_FOUND', 'Sticker is unavailable.', 404);
}

$receiverId = null;
if ($groupId > 0) {
    groupRequireMembership($pdo, $groupId, $userId);
} else {
    $targetStmt = $pdo->prepare('SELECT id FROM users WHERE username = ? LIMIT 1');
    $targetStmt->execute([$target]);
    $targetUser = $targetStmt->fetch(PDO::FETCH_ASSOC);
    if (!$targetUser) {
        apiError('TARGET_NOT_FOUND', 'Target user not found', 404);
    }
    $receiverId = (int) $targetUser['id'];
}

$insert = $pdo->prepare(
    "INSERT INTO messages (sender_id, receiver_id, group_id, message_type, sticker_id)
     VALUES (?, ?, ?, 'sticker', ?)"
);
$ok = $insert->execute([
    $userId,
    $receiverId,
    $groupId > 0 ? $groupId : null,
    $stickerId,
]);

if (!$ok) {
    apiError('SEND_FAILED', 'Something went wrong while sending sticker.', 409);
}

apiSuccess([
    'message_id' => (int) $pdo->lastInsertId(),
    'sticker_id' => $stickerId,
]);
