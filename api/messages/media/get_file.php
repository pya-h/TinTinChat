<?php
session_start();
require_once __DIR__ . '/../../../includes/db.php';
require_once __DIR__ . '/../../../includes/api_helpers.php';
require_once __DIR__ . '/../../../includes/group_helpers.php';

apiRequireMethod('GET');
$userId = apiRequireAuth();
session_write_close();
$messageId = isset($_GET['id']) ? intval($_GET['id']) : 0;

if (!$messageId) {
	http_response_code(400);
	exit('Missing message id');
}

$stmt = $pdo->prepare("SELECT sender_id, receiver_id, group_id, any_file_path FROM messages WHERE id = ? AND message_type IN ('file', 'video')");
$stmt->execute([$messageId]);
$message = $stmt->fetch();

if (!$message) {
	http_response_code(404);
	exit('Not found');
}

$groupId = isset($message['group_id']) ? (int) $message['group_id'] : 0;
if ($groupId > 0) {
	groupRequireMembership($pdo, $groupId, $userId);
} elseif ((int) $message['sender_id'] !== $userId && (int) $message['receiver_id'] !== $userId) {
	http_response_code(403);
	exit('Forbidden');
}

$filePath = $message['any_file_path'];
$fullPath = realpath(__DIR__ . '/../../../uploads/files/' . $filePath);
$uploadsDir = realpath(__DIR__ . '/../../../uploads/files/');

if (!$fullPath || !$uploadsDir || strpos($fullPath, $uploadsDir . DIRECTORY_SEPARATOR) !== 0 || !file_exists($fullPath)) {
	http_response_code(404);
	exit('File not found');
}

header('X-Content-Type-Options: nosniff');
header('Content-Type: application/octet-stream');
header('Content-Length: ' . filesize($fullPath));
header('Content-Disposition: attachment; filename="file.enc"');
readfile($fullPath);
exit;
