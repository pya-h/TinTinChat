<?php
session_start();
require_once __DIR__ . '/../../../includes/db.php';
require_once __DIR__ . '/../../../includes/api_helpers.php';
require_once __DIR__ . '/../../../includes/group_helpers.php';
require_once __DIR__ . '/../../../includes/block_helpers.php';

apiRequireMethod('POST');
$userId = apiRequireAuth();
apiRequireCsrf();
apiGuardOversizedPostBody();
const ENCRYPTED_VOICE_EXTENSION = 'bin';

$groupId = groupParseId($_POST['group_id'] ?? null);
$target = $groupId > 0
	? ''
	: apiNormalizeUsername($_POST['target'] ?? '', 'INVALID_TARGET_USERNAME');
$messageEncryptedForRecipient = trim((string) ($_POST['message'] ?? ''));
$messageEncryptedForSender = trim((string) ($_POST['message_for_sender'] ?? ''));

$voiceFile = apiRequireUploadedFile('voice_file');

if ($messageEncryptedForRecipient === '' || $messageEncryptedForSender === '') {
	apiError('MISSING_PARAMETERS', 'Missing encrypted media envelope', 400);
}

if ((int) $voiceFile['size'] > TTC_UPLOAD_VOICE_MAX_BYTES + 64) {
	apiError('FILE_TOO_LARGE', 'File too large. Maximum size is 10MB', 400);
}

$receiverId = null;
if ($groupId > 0) {
	groupRequireMembership($pdo, $groupId, $userId);
} else {
	$stmt = $pdo->prepare('SELECT id FROM users WHERE username = ?');
	$stmt->execute([$target]);
	$targetUser = $stmt->fetch();

	if (!$targetUser) {
		apiError('TARGET_NOT_FOUND', 'Target user not found', 404);
	}

	$receiverId = (int) $targetUser['id'];
	blockEnforceSenderAllowed($pdo, $userId, $receiverId);
}

$uploadsDir = __DIR__ . '/../../../uploads';
$voiceMessagesDir = __DIR__ . '/../../../uploads/voice_messages';

apiEnsureWritableDirectory($uploadsDir, 'uploads directory');
apiEnsureWritableDirectory($voiceMessagesDir, 'voice messages directory');

$uniqueFilename = uniqid('voice_enc_', true) . '.' . ENCRYPTED_VOICE_EXTENSION;
$uploadPath = $voiceMessagesDir . '/' . $uniqueFilename;

if (!move_uploaded_file($voiceFile['tmp_name'], $uploadPath)) {
	apiError('FILE_SAVE_FAILED', 'Failed to save voice file', 500);
}

$stmt = $pdo->prepare("INSERT INTO messages (sender_id, receiver_id, group_id, message, message_for_sender, message_type, voice_file_path, file_size) VALUES (?, ?, ?, ?, ?, 'voice', ?, ?)");
if (
	!$stmt->execute([
		$userId,
		$receiverId,
		$groupId > 0 ? $groupId : null,
		$messageEncryptedForRecipient,
		$messageEncryptedForSender,
		$uniqueFilename,
		(int) $voiceFile['size'],
	])
) {
	apiError('SEND_FAILED', 'Something went wrong while sending your message!', 409);
}

$messageId = $pdo->lastInsertId();

apiSuccess(['message_id' => $messageId, 'file_path' => $uniqueFilename]);
