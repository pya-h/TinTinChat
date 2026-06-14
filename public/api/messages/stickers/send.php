<?php
session_start();

require_once __DIR__ . '/../../../../tintin-core/includes/db.php';
require_once __DIR__ . '/../../../../tintin-core/includes/api_helpers.php';
require_once __DIR__ . '/../../../../tintin-core/includes/group_helpers.php';
require_once __DIR__ . '/../../../../tintin-core/includes/block_helpers.php';

apiRequireMethod('POST');
$userId = apiRequireAuth();
apiRequireCsrf();

$groupId = groupParseId($_POST['group_id'] ?? null);
$target = $groupId > 0 ? '' : apiNormalizeUsername($_POST['target'] ?? '', 'INVALID_TARGET_USERNAME');
$stickerId = isset($_POST['sticker_id']) ? (int) $_POST['sticker_id'] : 0;
$forwardedFromMessageId = isset($_POST['forwarded_from_message_id']) && is_numeric($_POST['forwarded_from_message_id'])
	? (int) $_POST['forwarded_from_message_id']
	: null;
$replyToMessageId = isset($_POST['reply_to_message_id']) && is_numeric($_POST['reply_to_message_id'])
	? (int) $_POST['reply_to_message_id']
	: null;

if ($stickerId <= 0) {
	apiError('INVALID_STICKER_ID', 'Invalid sticker id.', 400);
}

$stickerColumns = apiGetTableColumns($pdo, 'stickers');
if (empty($stickerColumns) || !isset($stickerColumns['id'])) {
	apiError('STICKER_SCHEMA_OUTDATED', 'Stickers schema is missing or outdated. Run migration 14_add_sticker_support.sql.', 500);
}

$stickerSql = 'SELECT id';
if (isset($stickerColumns['is_admin_only'])) {
	$stickerSql .= ', is_admin_only';
}
if (isset($stickerColumns['uploaded_by_user_id'])) {
	$stickerSql .= ', uploaded_by_user_id';
}
$stickerSql .= ' FROM stickers WHERE id = ?';
if (isset($stickerColumns['is_active'])) {
	$stickerSql .= ' AND is_active = 1';
}
$stickerSql .= ' LIMIT 1';

$stickerStmt = $pdo->prepare($stickerSql);
$stickerStmt->execute([$stickerId]);
$sticker = $stickerStmt->fetch(PDO::FETCH_ASSOC);
if (!$sticker) {
	apiError('STICKER_NOT_FOUND', 'Sticker is unavailable.', 404);
}

$isAdminOnly = isset($stickerColumns['is_admin_only']) && (int) ($sticker['is_admin_only'] ?? 0) === 1;
if ($isAdminOnly) {
	$isAdmin = apiIsAdminUser($pdo, $userId);
	$uploadedByUserId = isset($stickerColumns['uploaded_by_user_id']) ? (int) ($sticker['uploaded_by_user_id'] ?? 0) : 0;
	if (!$isAdmin && $uploadedByUserId !== $userId) {
		apiError('STICKER_FORBIDDEN', 'Sticker is unavailable.', 403);
	}
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
	blockEnforceSenderAllowed($pdo, $userId, $receiverId);
}

if ($replyToMessageId) {
	if ($groupId > 0) {
		$replyStmt = $pdo->prepare('SELECT id FROM messages WHERE id = ? AND group_id = ? LIMIT 1');
		$replyStmt->execute([$replyToMessageId, $groupId]);
	} else {
		$replyStmt = $pdo->prepare(
			'SELECT id FROM messages WHERE id = ? AND ((sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)) LIMIT 1'
		);
		$replyStmt->execute([$replyToMessageId, $userId, $receiverId, $receiverId, $userId]);
	}
	if (!$replyStmt->fetch()) {
		apiError('INVALID_REPLY_TARGET', 'Invalid reply target message', 400);
	}
}

$insert = $pdo->prepare(
	"INSERT INTO messages (sender_id, receiver_id, group_id, message_type, sticker_id, reply_to_message_id, forwarded_from_message_id, forwarded_by_user_id)
	 VALUES (?, ?, ?, 'sticker', ?, ?, ?, ?)"
);
$ok = $insert->execute([
	$userId,
	$receiverId,
	$groupId > 0 ? $groupId : null,
	$stickerId,
	$replyToMessageId,
	$forwardedFromMessageId,
	$forwardedFromMessageId ? $userId : null,
]);

if (!$ok) {
	apiError('SEND_FAILED', 'Something went wrong while sending sticker.', 409);
}

apiSuccess([
	'message_id' => (int) $pdo->lastInsertId(),
	'sticker_id' => $stickerId,
]);
