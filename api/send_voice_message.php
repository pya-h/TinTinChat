<?php
session_start();
require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/api_helpers.php';

apiRequireMethod('POST');
$userId = apiRequireAuth();
apiRequireCsrf();
apiGuardOversizedPostBody();

const VOICE_MAX_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_VOICE_EXTENSIONS = ['wav', 'mp3', 'ogg', 'webm'];
const ALLOWED_VOICE_MIME_TYPES = [
    'audio/wav',
    'audio/x-wav',
    'audio/mpeg',
    'audio/mp3',
    'audio/ogg',
    'audio/webm',
];

$target = $_POST['target'] ?? '';
$messageEncryptedForRecipient = $_POST['message'] ?? null;
$messageEncryptedForSender = $_POST['message_for_sender'] ?? null;

if (!$target) {
    apiError('MISSING_PARAMETERS', 'Missing parameters', 400);
}

$voiceFile = apiRequireUploadedFile('voice_file');

$fileExtension = strtolower(pathinfo($voiceFile['name'], PATHINFO_EXTENSION));
if (!in_array($fileExtension, ALLOWED_VOICE_EXTENSIONS, true)) {
    apiError('INVALID_FILE_TYPE', 'Invalid file type. Only WAV, MP3, OGG, and WebM are allowed', 400);
}

$detectedMime = apiDetectMimeType($voiceFile['tmp_name']);
if (!in_array($detectedMime, ALLOWED_VOICE_MIME_TYPES, true)) {
    apiError('INVALID_FILE_TYPE', 'Invalid audio MIME type.', 400);
}

if ((int) $voiceFile['size'] > VOICE_MAX_SIZE_BYTES) {
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

apiEnsureWritableDirectory($uploadsDir, 'uploads directory');
apiEnsureWritableDirectory($voiceMessagesDir, 'voice messages directory');

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
