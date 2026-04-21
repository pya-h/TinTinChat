<?php
session_start();

require_once __DIR__ . '/../../../includes/db.php';
require_once __DIR__ . '/../../../includes/api_helpers.php';
require_once __DIR__ . '/../../../includes/group_helpers.php';
require_once __DIR__ . '/../../../includes/block_helpers.php';

apiRequireMethod('POST');
$sender_id = apiRequireAuth();
apiRequireCsrf();
session_write_close();
apiGuardOversizedPostBody();
const ENCRYPTED_IMAGE_EXTENSION = 'bin';

$groupId = groupParseId($_POST['group_id'] ?? null);
$target_username = $groupId > 0
	? ''
	: apiNormalizeUsername($_POST['target'] ?? null, 'INVALID_TARGET_USERNAME');
$message_for_recipient = trim((string) ($_POST['message'] ?? ''));
$message_for_sender = trim((string) ($_POST['message_for_sender'] ?? ''));
$forwardedFromMessageId = isset($_POST['forwarded_from_message_id']) && is_numeric($_POST['forwarded_from_message_id'])
	? (int) $_POST['forwarded_from_message_id']
	: null;
$replyToMessageId = isset($_POST['reply_to_message_id']) && is_numeric($_POST['reply_to_message_id'])
	? (int) $_POST['reply_to_message_id']
	: null;
$rawGroupedWith = trim((string) ($_POST['grouped_with'] ?? ''));
$groupedWithSelf = ($rawGroupedWith === 'self');
$groupedWith = (!$groupedWithSelf && $rawGroupedWith !== '' && is_numeric($rawGroupedWith))
	? (int) $rawGroupedWith
	: null;
$image_file = apiRequireUploadedFile('image_file');

if ($message_for_recipient === '' || $message_for_sender === '') {
	apiError('MISSING_PARAMETERS', 'Missing encrypted media envelope', 400);
}

$receiver_id = null;
if ($groupId > 0) {
	groupRequireMembership($pdo, $groupId, $sender_id);
} else {
	$stmt = $pdo->prepare('SELECT id FROM users WHERE username = ?');
	$stmt->execute([$target_username]);
	$receiver = $stmt->fetch();

	if (!$receiver) {
		apiError('TARGET_NOT_FOUND', 'Target user not found', 404);
	}
	$receiver_id = (int) $receiver['id'];
	blockEnforceSenderAllowed($pdo, $sender_id, $receiver_id);
}

$upload_dir = __DIR__ . '/../../../uploads/images/';

if ((int) $image_file['size'] > TTC_UPLOAD_IMAGE_MAX_BYTES + 64) {
	apiError('FILE_TOO_LARGE', 'Image file is too large. Max 20MB allowed.', 400);
}

$unique_filename = uniqid('img_enc_', true) . '.' . ENCRYPTED_IMAGE_EXTENSION;
$upload_path = $upload_dir . $unique_filename;

if ($replyToMessageId) {
	if ($groupId > 0) {
		$replyStmt = $pdo->prepare('SELECT id FROM messages WHERE id = ? AND group_id = ? LIMIT 1');
		$replyStmt->execute([$replyToMessageId, $groupId]);
	} else {
		$replyStmt = $pdo->prepare(
			'SELECT id FROM messages WHERE id = ? AND ((sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)) LIMIT 1'
		);
		$replyStmt->execute([$replyToMessageId, $sender_id, $receiver_id, $receiver_id, $sender_id]);
	}
	if (!$replyStmt->fetch()) {
		apiError('INVALID_REPLY_TARGET', 'Invalid reply target message', 400);
	}
}

if ($groupedWith !== null) {
	if ($groupId > 0) {
		$gwStmt = $pdo->prepare("SELECT id FROM messages WHERE id = ? AND group_id = ? AND sender_id = ? AND message_type = 'image' LIMIT 1");
		$gwStmt->execute([$groupedWith, $groupId, $sender_id]);
	} else {
		$gwStmt = $pdo->prepare("SELECT id FROM messages WHERE id = ? AND sender_id = ? AND receiver_id = ? AND message_type = 'image' LIMIT 1");
		$gwStmt->execute([$groupedWith, $sender_id, $receiver_id]);
	}
	if (!$gwStmt->fetch()) {
		apiError('INVALID_GROUPED_WITH', 'Invalid group reference', 400);
	}

}

if (!move_uploaded_file($image_file['tmp_name'], $upload_path)) {
	apiEnsureWritableDirectory($upload_dir, 'images directory');
	if (!move_uploaded_file($image_file['tmp_name'], $upload_path)) {
		apiError('FILE_MOVE_FAILED', 'Failed to move uploaded file.', 500);
	}
}

try {
	$pdo->beginTransaction();

	// Enforce server-side limit on photos per group (max 10) — inside transaction to avoid TOCTOU race
	if ($groupedWith !== null) {
		$countStmt = $pdo->prepare('SELECT COUNT(*) FROM messages WHERE grouped_with = ? FOR UPDATE');
		$countStmt->execute([$groupedWith]);
		if ((int) $countStmt->fetchColumn() >= 10) {
			$pdo->rollBack();
			@unlink($upload_path);
			apiError('GROUP_LIMIT_REACHED', 'Maximum of 10 photos per group', 400);
		}
	}

	$stmt = $pdo->prepare(
		"INSERT INTO messages (sender_id, receiver_id, group_id, message, message_for_sender, message_type, image_file_path, file_size, reply_to_message_id, forwarded_from_message_id, forwarded_by_user_id, grouped_with)
		 VALUES (?, ?, ?, ?, ?, 'image', ?, ?, ?, ?, ?, ?)"
	);
	if (
		!$stmt->execute([
			$sender_id,
			$receiver_id,
			$groupId > 0 ? $groupId : null,
			$message_for_recipient,
			$message_for_sender,
			$unique_filename,
			(int) $image_file['size'],
			$replyToMessageId,
			$forwardedFromMessageId,
			$forwardedFromMessageId ? $sender_id : null,
			$groupedWith,
		])
	) {
		$pdo->rollBack();
		apiError('SEND_FAILED', 'Something went wrong while sending your message!', 409);
	}

	$newMessageId = (int) $pdo->lastInsertId();

	// For the first photo in a group, set grouped_with to its own id
	if ($groupedWithSelf) {
		$pdo->prepare('UPDATE messages SET grouped_with = ? WHERE id = ?')
			->execute([$newMessageId, $newMessageId]);
		$groupedWith = $newMessageId;
	}

	$pdo->commit();

	apiSuccess([
		'message_id' => $newMessageId,
		'grouped_with' => $groupedWith,
		'message' => 'Image sent successfully'
	]);
} catch (PDOException $e) {
	if ($pdo->inTransaction()) {
		$pdo->rollBack();
	}
	@unlink($upload_path);
	apiError('DB_SAVE_FAILED', 'Failed to save image message', 500);
}
