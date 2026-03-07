<?php
session_start();
require_once __DIR__ . '/../includes/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    exit('Invalid request method');
}

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    exit('Not authorized');
}

$userId = $_SESSION['user_id'];
$messageId = isset($_GET['id']) ? intval($_GET['id']) : 0;

if (!$messageId) {
    http_response_code(400);
    exit('Missing message id');
}

$stmt = $pdo->prepare("SELECT * FROM messages WHERE id = ? AND message_type = 'file'");
$stmt->execute([$messageId]);
$message = $stmt->fetch();

if (!$message || ($message['sender_id'] != $userId && $message['receiver_id'] != $userId)) {
    http_response_code(403);
    exit('Forbidden');
}

$filePath = $message['any_file_path'];
$fullPath = realpath(__DIR__ . '/../uploads/files/' . $filePath);
$uploadsDir = realpath(__DIR__ . '/../uploads/files/');

if (!$fullPath || strpos($fullPath, $uploadsDir) !== 0 || !file_exists($fullPath)) {
    http_response_code(404);
    exit('File not found');
}

$originalFileName = $filePath;
if (strpos($filePath, '_') !== false) {
    $parts = explode('_', $filePath);
    if (count($parts) > 2) {
        $originalFileName = implode('_', array_slice($parts, 2));
    } else {
        $originalFileName = $parts[count($parts) - 1];
    }
}

$mimeType = mime_content_type($fullPath);
header('Content-Type: ' . $mimeType);
header('Content-Length: ' . filesize($fullPath));
header('Content-Disposition: attachment; filename="' . basename($originalFileName) . '"');
readfile($fullPath);
exit;

