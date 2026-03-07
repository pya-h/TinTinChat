<?php
session_start();
require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/api_helpers.php';

apiRequireMethod('POST');
$userId = apiRequireAuth();
apiRequireCsrf();
$target = $_POST['target'] ?? '';
$messageEncryptedForRecipient = $_POST['message'] ?? null;
$messageEncryptedForSender = $_POST['message_for_sender'] ?? null;

if (!$target) {
    apiError('MISSING_PARAMETERS', 'Missing parameters', 400);
}

if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    apiError('UPLOAD_FAILED', 'File upload failed', 400);
}

$file = $_FILES['file'];
$maxSize = 50 * 1024 * 1024;  // 50MB

if ($file['size'] > $maxSize) {
    apiError('FILE_TOO_LARGE', 'File too large. Maximum size is 50MB', 400);
}

$stmt = $pdo->prepare('SELECT id FROM users WHERE username = ?');
$stmt->execute([$target]);
$targetUser = $stmt->fetch();

if (!$targetUser) {
    apiError('TARGET_NOT_FOUND', 'Target user not found', 404);
}

$uploadsDir = __DIR__ . '/../uploads';
$filesDir = __DIR__ . '/../uploads/files';

if (!is_dir($uploadsDir)) {
    if (!mkdir($uploadsDir, 0755, true)) {
        apiError('DIRECTORY_CREATE_FAILED', 'Failed to create uploads directory', 500);
    }
}

if (!is_dir($filesDir)) {
    if (!mkdir($filesDir, 0755, true)) {
        apiError('DIRECTORY_CREATE_FAILED', 'Failed to create files directory', 500);
    }
}

if (!is_writable($filesDir)) {
    apiError('DIRECTORY_NOT_WRITABLE', 'Files directory is not writable', 500);
}

$fileExtension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
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

