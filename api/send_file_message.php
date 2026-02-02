<?php
session_start();
require_once __DIR__ . '/../includes/db.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Not logged in']);
    exit;
}

$userId = $_SESSION['user_id'];
$target = $_POST['target'] ?? '';
$messageEncryptedForRecipient = $_POST['message'] ?? null;
$messageEncryptedForSender = $_POST['message_for_sender'] ?? null;

if (!$target) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing parameters']);
    exit;
}

if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['error' => 'File upload failed']);
    exit;
}

$file = $_FILES['file'];
$maxSize = 50 * 1024 * 1024;  // 50MB

if ($file['size'] > $maxSize) {
    http_response_code(400);
    echo json_encode(['error' => 'File too large. Maximum size is 50MB']);
    exit;
}

$stmt = $pdo->prepare('SELECT id FROM users WHERE username = ?');
$stmt->execute([$target]);
$targetUser = $stmt->fetch();

if (!$targetUser) {
    http_response_code(404);
    echo json_encode(['error' => 'Target user not found']);
    exit;
}

$uploadsDir = '../uploads';
$filesDir = '../uploads/files';

if (!is_dir($uploadsDir)) {
    if (!mkdir($uploadsDir, 0755, true)) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to create uploads directory']);
        exit;
    }
}

if (!is_dir($filesDir)) {
    if (!mkdir($filesDir, 0755, true)) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to create files directory']);
        exit;
    }
}

if (!is_writable($filesDir)) {
    http_response_code(500);
    echo json_encode(['error' => 'Files directory is not writable']);
    exit;
}

$fileExtension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
$originalFileName = pathinfo($file['name'], PATHINFO_FILENAME);
$uniqueFilename = uniqid('file_', true) . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '_', $originalFileName) . ($fileExtension ? '.' . $fileExtension : '');
$uploadPath = $filesDir . '/' . $uniqueFilename;

if (!move_uploaded_file($file['tmp_name'], $uploadPath)) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save file']);
    exit;
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
    http_response_code(409);
    echo json_encode(['status' => 'failed', 'error' => 'Something went wrong while sending your message!']);
    exit;
}

$messageId = $pdo->lastInsertId();

echo json_encode(['status' => 'ok', 'message_id' => $messageId, 'file_path' => $uniqueFilename, 'file_size' => $file['size']]);

