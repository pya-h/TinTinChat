<?php
session_start();

require_once __DIR__ . '/../../../../tintin-core/includes/db.php';
require_once __DIR__ . '/../../../../tintin-core/includes/api_helpers.php';
require_once __DIR__ . '/../../../../tintin-core/includes/group_helpers.php';

apiRequireMethod('GET');
$user_id = apiRequireAuth();
session_write_close();

$message_id = $_GET['id'] ?? null;
if (!$message_id || !is_numeric($message_id)) {
	http_response_code(400);
	exit('Bad Request: Missing message ID');
}

$stmt = $pdo->prepare("SELECT sender_id, receiver_id, group_id, image_file_path FROM messages WHERE id = ? AND message_type = 'image'");
$stmt->execute([(int) $message_id]);
$message = $stmt->fetch();

if (!$message) {
	http_response_code(404);
	exit('Not Found: Image message not found.');
}

$groupId = isset($message['group_id']) ? (int) $message['group_id'] : 0;
if ($groupId > 0) {
	groupRequireMembership($pdo, $groupId, $user_id);
} elseif ((int) $message['sender_id'] !== $user_id && (int) $message['receiver_id'] !== $user_id) {
	http_response_code(403);
	exit('Access Denied: You do not have permission to view this image.');
}

$uploadsDir = realpath(__DIR__ . '/../../../../tintin-core/uploads/images/');
$fileName = basename((string) ($message['image_file_path'] ?? ''));
$fullPath = $uploadsDir
	? realpath($uploadsDir . DIRECTORY_SEPARATOR . $fileName)
	: false;

if (
	!$uploadsDir ||
	$fileName === '' ||
	$fileName === '.' ||
	$fileName === '..' ||
	!$fullPath ||
	strpos($fullPath, $uploadsDir . DIRECTORY_SEPARATOR) !== 0 ||
	!is_file($fullPath)
) {
	http_response_code(404);
	exit('Not Found: The image file is missing from the server.');
}

header('X-Content-Type-Options: nosniff');
header('Content-Type: application/octet-stream');
header('Content-Length: ' . filesize($fullPath));
header('Content-Disposition: inline; filename="image.enc"');
readfile($fullPath);
exit;
