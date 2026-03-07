<?php
session_start();
require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/api_helpers.php';

apiRequireMethod('POST');
$userId = apiRequireAuth();
apiRequireCsrf();
apiGuardOversizedPostBody();

const FILE_MAX_SIZE_BYTES = 50 * 1024 * 1024;
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

$target = $_POST['target'] ?? '';
$messageEncryptedForRecipient = $_POST['message'] ?? null;
$messageEncryptedForSender = $_POST['message_for_sender'] ?? null;

if (!$target) {
    apiError('MISSING_PARAMETERS', 'Missing parameters', 400);
}

$file = apiRequireUploadedFile('file');

if ((int) $file['size'] > FILE_MAX_SIZE_BYTES) {
    apiError('FILE_TOO_LARGE', 'File too large. Maximum size is 50MB', 400);
}

$fileExtension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
if ($fileExtension && in_array($fileExtension, BLOCKED_FILE_EXTENSIONS, true)) {
    apiError('BLOCKED_FILE_TYPE', 'This file type is not allowed for security reasons', 400);
}

$detectedMime = apiDetectMimeType($file['tmp_name']);
if (in_array($detectedMime, BLOCKED_FILE_MIME_TYPES, true)) {
    apiError('BLOCKED_FILE_TYPE', 'This file MIME type is not allowed for security reasons', 400);
}

$stmt = $pdo->prepare('SELECT id FROM users WHERE username = ?');
$stmt->execute([$target]);
$targetUser = $stmt->fetch();

if (!$targetUser) {
    apiError('TARGET_NOT_FOUND', 'Target user not found', 404);
}

$uploadsDir = __DIR__ . '/../uploads';
$filesDir = __DIR__ . '/../uploads/files';

apiEnsureWritableDirectory($uploadsDir, 'uploads directory');
apiEnsureWritableDirectory($filesDir, 'files directory');

$originalFileName = pathinfo($file['name'], PATHINFO_FILENAME);
$uniqueFilename = uniqid('file_', true) . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '_', $originalFileName) . ($fileExtension ? '.' . $fileExtension : '');
$uploadPath = $filesDir . '/' . $uniqueFilename;

if (!move_uploaded_file($file['tmp_name'], $uploadPath)) {
    apiError('FILE_SAVE_FAILED', 'Failed to save file', 500);
}

$stmt = $pdo->prepare("INSERT INTO messages (sender_id, receiver_id, message, message_for_sender, message_type, any_file_path, file_size) VALUES (?, ?, ?, ?, 'file', ?, ?)");
if (
    !$stmt->execute([
        $userId,
        $targetUser['id'],
        $messageEncryptedForRecipient,
        $messageEncryptedForSender,
        $uniqueFilename,
        $file['size'],
    ])
) {
    apiError('SEND_FAILED', 'Something went wrong while sending your message!', 409);
}

$messageId = $pdo->lastInsertId();

apiSuccess(['message_id' => $messageId, 'file_path' => $uniqueFilename, 'file_size' => $file['size']]);

