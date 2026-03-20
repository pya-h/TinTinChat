<?php
session_start();
require_once __DIR__ . '/../../includes/db.php';
require_once __DIR__ . '/../../includes/api_helpers.php';
require_once __DIR__ . '/../../includes/group_helpers.php';
require_once __DIR__ . '/../../includes/block_helpers.php';

apiRequireMethod('POST');
$userId = apiRequireAuth();
apiRequireCsrf();
session_write_close();
$target = isset($_POST['target']) ? trim((string) $_POST['target']) : '';
$groupId = groupParseId($_POST['group_id'] ?? null);
$messageEncryptedForRecipient = $_POST['message'] ?? '';
$messageEncryptedForSender = $_POST['message_for_sender'] ?? '';
$replyToMessageId = isset($_POST['reply_to_message_id']) && is_numeric($_POST['reply_to_message_id'])
	? (int) $_POST['reply_to_message_id']
	: null;
$forwardedFromMessageId = isset($_POST['forwarded_from_message_id']) && is_numeric($_POST['forwarded_from_message_id'])
	? (int) $_POST['forwarded_from_message_id']
	: null;

if (!$messageEncryptedForRecipient || !$messageEncryptedForSender) {
	apiError('MISSING_PARAMETERS', 'Missing parameters', 400);
}

$maxMessageBytes = 256 * 1024;
if (strlen($messageEncryptedForRecipient) > $maxMessageBytes || strlen($messageEncryptedForSender) > $maxMessageBytes) {
	apiError('MESSAGE_TOO_LARGE', 'Message payload exceeds maximum allowed size', 400);
}
$targetUser = null;
if ($groupId > 0) {
	groupRequireMembership($pdo, $groupId, $userId);
} else {
	$target = apiNormalizeUsername($target, 'INVALID_TARGET_USERNAME');
	$stmt = $pdo->prepare('SELECT id FROM users WHERE username = ?');
	$stmt->execute([$target]);
	$targetUser = $stmt->fetch();

	if (!$targetUser) {
		apiError('TARGET_NOT_FOUND', 'Target user not found', 404);
	}
	blockEnforceSenderAllowed($pdo, $userId, (int) $targetUser['id']);
}

if ($replyToMessageId) {
	if ($groupId > 0) {
		$replyStmt = $pdo->prepare('SELECT id FROM messages WHERE id = ? AND group_id = ? LIMIT 1');
		$replyStmt->execute([$replyToMessageId, $groupId]);
	} else {
		$replyStmt = $pdo->prepare(
			'SELECT id FROM messages WHERE id = ? AND ((sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)) LIMIT 1'
		);
		$replyStmt->execute([$replyToMessageId, $userId, $targetUser['id'], $targetUser['id'], $userId]);
	}

	if (!$replyStmt->fetch()) {
		apiError('INVALID_REPLY_TARGET', 'Invalid reply target message', 400);
	}
}

if ($forwardedFromMessageId) {
	$forwardStmt = $pdo->prepare(
		'SELECT m.id
		 FROM messages m
		 LEFT JOIN group_members gm ON gm.group_id = m.group_id AND gm.user_id = ?
		 WHERE m.id = ?
		   AND (
				m.sender_id = ?
				OR m.receiver_id = ?
				OR gm.user_id IS NOT NULL
		   )
		 LIMIT 1'
	);
	$forwardStmt->execute([$userId, $forwardedFromMessageId, $userId, $userId]);
	if (!$forwardStmt->fetch()) {
		apiError('INVALID_FORWARD_TARGET', 'Invalid forwarded source message', 400);
	}
}

$receiverId = $groupId > 0 ? null : (int) $targetUser['id'];
$stmt = $pdo->prepare("INSERT INTO messages (sender_id, receiver_id, group_id, message, message_for_sender, message_type, reply_to_message_id, forwarded_from_message_id, forwarded_by_user_id) VALUES (?, ?, ?, ?, ?, 'text', ?, ?, ?)");
if (
	!$stmt->execute([
		$userId,
		$receiverId,
		$groupId > 0 ? $groupId : null,
		$messageEncryptedForRecipient,
		$messageEncryptedForSender,
		$replyToMessageId,
		$forwardedFromMessageId,
		$forwardedFromMessageId ? $userId : null,
	])
) {
	apiError('SEND_FAILED', 'Something went wrong while sending your message!', 409);
}

$messageId = $pdo->lastInsertId();

apiSuccess(['message_id' => $messageId]);
