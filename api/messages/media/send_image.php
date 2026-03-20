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

if (!move_uploaded_file($image_file['tmp_name'], $upload_path)) {
	apiEnsureWritableDirectory($upload_dir, 'images directory');
	if (!move_uploaded_file($image_file['tmp_name'], $upload_path)) {
		apiError('FILE_MOVE_FAILED', 'Failed to move uploaded file.', 500);
	}
}

try {
	$stmt = $pdo->prepare(
		"INSERT INTO messages (sender_id, receiver_id, group_id, message, message_for_sender, message_type, image_file_path, file_size) 
		 VALUES (?, ?, ?, ?, ?, 'image', ?, ?)"
	);
	if (
		!$stmt->execute([
			$sender_id,
			$receiver_id,
			$groupId > 0 ? $groupId : null,
			$message_for_recipient,
			$message_for_sender,
			'uploads/images/' . $unique_filename,
			(int) $image_file['size'],
		])
	) {
		apiError('SEND_FAILED', 'Something went wrong while sending your message!', 409);
	}

	apiSuccess([
		'message_id' => (int) $pdo->lastInsertId(),
		'message' => 'Image sent successfully'
	]);
} catch (PDOException $e) {
	@unlink($upload_path);
	apiError('DB_SAVE_FAILED', 'Failed to save image message', 500);
}
