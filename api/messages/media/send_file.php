<?php
session_start();
require_once __DIR__ . '/../../../includes/db.php';
require_once __DIR__ . '/../../../includes/api_helpers.php';
require_once __DIR__ . '/../../../includes/group_helpers.php';
require_once __DIR__ . '/../../../includes/block_helpers.php';

apiRequireMethod('POST');
$userId = apiRequireAuth();
apiRequireCsrf();
session_write_close();
apiGuardOversizedPostBody();
const BLOCKED_FILE_EXTENSIONS = [
	'php', 'phtml', 'php3', 'php4', 'php5', 'phar',
	'exe', 'msi', 'bat', 'cmd', 'com', 'scr',
	'sh', 'bash', 'zsh', 'ps1',
	'js', 'mjs', 'cjs',
];
const BLOCKED_FILE_MIME_TYPES = [
	'application/x-php',
	'text/x-php',
	'application/x-httpd-php',
	'application/x-dosexec',
	'application/x-msdownload',
	'application/x-sh',
	'text/x-shellscript',
	'application/javascript',
	'text/javascript',
];

$groupId = groupParseId($_POST['group_id'] ?? null);
$target = $groupId > 0
	? ''
	: apiNormalizeUsername($_POST['target'] ?? '', 'INVALID_TARGET_USERNAME');
$messageType = strtolower(trim((string) ($_POST['message_type'] ?? 'file')));
$messageType = in_array($messageType, ['file', 'video'], true) ? $messageType : 'file';
$messageEncryptedForRecipient = trim((string) ($_POST['message'] ?? ''));
$messageEncryptedForSender = trim((string) ($_POST['message_for_sender'] ?? ''));

$file = apiRequireUploadedFile('file');

if ($messageEncryptedForRecipient === '' || $messageEncryptedForSender === '') {
	apiError('MISSING_PARAMETERS', 'Missing encrypted media envelope', 400);
}

if ((int) $file['size'] > TTC_UPLOAD_FILE_MAX_BYTES + 64) {
	apiError('FILE_TOO_LARGE', 'File too large. Maximum size is 100MB', 400);
}

$uploadedName = (string) ($file['name'] ?? '');
$fileExtension = strtolower(pathinfo($uploadedName, PATHINFO_EXTENSION));
if ($fileExtension && in_array($fileExtension, BLOCKED_FILE_EXTENSIONS, true)) {
	apiError('BLOCKED_FILE_TYPE', 'This file type is not allowed for security reasons', 400);
}

$detectedMime = apiDetectMimeType($file['tmp_name']);
if (in_array($detectedMime, BLOCKED_FILE_MIME_TYPES, true)) {
	apiError('BLOCKED_FILE_TYPE', 'This file MIME type is not allowed for security reasons', 400);
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
$filesDir = __DIR__ . '/../../../uploads/files';

$uniqueFilename = uniqid('file_enc_', true) . '.bin';
$uploadPath = $filesDir . '/' . $uniqueFilename;

if (!move_uploaded_file($file['tmp_name'], $uploadPath)) {
	apiEnsureWritableDirectory($uploadsDir, 'uploads directory');
	apiEnsureWritableDirectory($filesDir, 'files directory');
	if (!move_uploaded_file($file['tmp_name'], $uploadPath)) {
		apiError('FILE_SAVE_FAILED', 'Failed to save file', 500);
	}
}

$stmt = $pdo->prepare("INSERT INTO messages (sender_id, receiver_id, group_id, message, message_for_sender, message_type, any_file_path, file_size) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
if (
	!$stmt->execute([
		$userId,
		$receiverId,
		$groupId > 0 ? $groupId : null,
		$messageEncryptedForRecipient,
		$messageEncryptedForSender,
		$messageType,
		$uniqueFilename,
		$file['size'],
	])
) {
	apiError('SEND_FAILED', 'Something went wrong while sending your message!', 409);
}

$messageId = $pdo->lastInsertId();

apiSuccess(['message_id' => $messageId, 'file_path' => $uniqueFilename, 'file_size' => $file['size']]);
