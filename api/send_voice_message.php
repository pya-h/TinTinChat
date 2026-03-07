<?php
session_start();
require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/api_helpers.php';

apiRequireMethod('POST');
$userId = apiRequireAuth();
$target = $_POST['target'] ?? '';
$messageEncryptedForRecipient = $_POST['message'] ?? null;
$messageEncryptedForSender = $_POST['message_for_sender'] ?? null;

if (!$target) {
    apiError('MISSING_PARAMETERS', 'Missing parameters', 400);
}

if (!isset($_FILES['voice_file']) || $_FILES['voice_file']['error'] !== UPLOAD_ERR_OK) {
    apiError('UPLOAD_FAILED', 'Voice file upload failed', 400);
}

$voiceFile = $_FILES['voice_file'];
$allowedTypes = ['audio/wav', 'audio/mp3', 'audio/ogg', 'audio/webm'];
$allowedExtensions = ['wav', 'mp3', 'ogg', 'webm'];
$maxSize = 10 * 1024 * 1024;  // 10MB

$fileExtension = strtolower(pathinfo($voiceFile['name'], PATHINFO_EXTENSION));
if (!in_array($voiceFile['type'], $allowedTypes) || !in_array($fileExtension, $allowedExtensions)) {
    apiError('INVALID_FILE_TYPE', 'Invalid file type. Only WAV, MP3, OGG, and WebM are allowed', 400);
}

if ($voiceFile['size'] > $maxSize) {
    apiError('FILE_TOO_LARGE', 'File too large. Maximum size is 10MB', 400);
}

$stmt = $pdo->prepare('SELECT id FROM users WHERE username = ?');
$stmt->execute([$target]);
$targetUser = $stmt->fetch();

if (!$targetUser) {
    apiError('TARGET_NOT_FOUND', 'Target user not found', 404);
}

$uploadsDir = __DIR__ . '/../uploads';
$voiceMessagesDir = __DIR__ . '/../uploads/voice_messages';

if (!is_dir($uploadsDir)) {
    if (!mkdir($uploadsDir, 0755, true)) {
        apiError('DIRECTORY_CREATE_FAILED', 'Failed to create uploads directory', 500);
    }
}

if (!is_dir($voiceMessagesDir)) {
    if (!mkdir($voiceMessagesDir, 0755, true)) {
        apiError('DIRECTORY_CREATE_FAILED', 'Failed to create voice messages directory', 500);
    }
}

if (!is_writable($voiceMessagesDir)) {
    apiError('DIRECTORY_NOT_WRITABLE', 'Voice messages directory is not writable', 500);
}

$uniqueFilename = uniqid('voice_', true) . '.' . $fileExtension;
$uploadPath = $voiceMessagesDir . '/' . $uniqueFilename;

if (!move_uploaded_file($voiceFile['tmp_name'], $uploadPath)) {
    apiError('FILE_SAVE_FAILED', 'Failed to save voice file', 500);
}

$stmt = $pdo->prepare("INSERT INTO messages (sender_id, receiver_id, message, message_for_sender, message_type, voice_file_path) VALUES (?, ?, ?, ?, 'voice', ?)");
if (
    !$stmt->execute([
        $userId,
        $targetUser['id'],
        $messageEncryptedForRecipient,
        $messageEncryptedForSender,
        $uniqueFilename,
    ])
) {
    apiError('SEND_FAILED', 'Something went wrong while sending your message!', 409);
}

$messageId = $pdo->lastInsertId();

apiSuccess(['message_id' => $messageId, 'file_path' => $uniqueFilename]);
