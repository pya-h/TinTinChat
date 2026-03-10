<?php
session_start();
require_once __DIR__ . '/../../includes/db.php';
require_once __DIR__ . '/../../includes/api_helpers.php';

apiRequireMethod('DELETE');
$userId = apiRequireAuth();
apiRequireCsrf();

$data = apiGetJsonBody();
$messages = isset($data['messages']) ? $data['messages'] : (is_array($data) ? $data : null);
$deleteForEveryone = !empty($data['delete_for_everyone']);

if (!$messages || !is_array($messages)) {
	apiError('MISSING_MESSAGES', 'No messages specified!', 400);
}

$messages = array_filter($messages, 'is_numeric');
$messages = array_map('intval', $messages);

if (empty($messages)) {
	apiError('INVALID_MESSAGES', 'No valid message IDs provided!', 400);
}

$placeholders = implode(',', array_fill(0, count($messages), '?'));

$accessStmt = null;
if ($deleteForEveryone) {
	$accessStmt = $pdo->prepare(
		"SELECT id, message_type, voice_file_path, image_file_path, any_file_path
		 FROM messages
		 WHERE id IN ($placeholders) AND sender_id = ?"
	);
	$accessStmt->execute(array_merge($messages, [$userId]));
} else {
	$accessStmt = $pdo->prepare(
		"SELECT id, message_type, voice_file_path, image_file_path, any_file_path
		 FROM messages
		 WHERE id IN ($placeholders) AND (receiver_id = ? OR sender_id = ?)"
	);
	$accessStmt->execute(array_merge($messages, [$userId, $userId]));
}

$rows = $accessStmt->fetchAll(PDO::FETCH_ASSOC);
$deletableIds = array_values(array_filter(array_map(static function ($row) {
	return isset($row['id']) ? (int) $row['id'] : 0;
}, $rows), static function ($id) {
	return $id > 0;
}));

if ($deleteForEveryone) {
	if (empty($deletableIds)) {
		apiError('DELETE_FOR_EVERYONE_FORBIDDEN', 'Only the message sender can delete for everyone', 403);
	}
}

if (empty($deletableIds)) {
	apiSuccess(['messages_deleted' => 0, 'message_ids' => []]);
}

$deletablePlaceholders = implode(',', array_fill(0, count($deletableIds), '?'));
$deleteStmt = $pdo->prepare("DELETE FROM messages WHERE id IN ($deletablePlaceholders)");
if (!$deleteStmt->execute($deletableIds)) {
	apiError('DELETE_FAILED', 'Could not delete the messages!', 409);
}

$filesToDelete = [];
foreach ($rows as $row) {
	$messageType = isset($row['message_type']) ? (string) $row['message_type'] : '';
	if ($messageType === 'voice' && !empty($row['voice_file_path'])) {
		$filesToDelete[] = ['dir' => __DIR__ . '/../../uploads/voice_messages', 'name' => (string) $row['voice_file_path']];
	} elseif ($messageType === 'image' && !empty($row['image_file_path'])) {
		$filesToDelete[] = ['dir' => __DIR__ . '/../../uploads/images', 'name' => (string) $row['image_file_path']];
	} elseif (($messageType === 'file' || $messageType === 'video') && !empty($row['any_file_path'])) {
		$filesToDelete[] = ['dir' => __DIR__ . '/../../uploads/files', 'name' => (string) $row['any_file_path']];
	}
}

$filesDeleted = 0;
foreach ($filesToDelete as $entry) {
	$baseDir = realpath($entry['dir']);
	if (!$baseDir) {
		continue;
	}
	$fileName = basename((string) ($entry['name'] ?? ''));
	if ($fileName === '' || $fileName === '.' || $fileName === '..') {
		continue;
	}
	$fullPath = realpath($baseDir . DIRECTORY_SEPARATOR . $fileName);
	if (!$fullPath || strpos($fullPath, $baseDir) !== 0 || !is_file($fullPath)) {
		continue;
	}
	if (@unlink($fullPath)) {
		$filesDeleted++;
	}
}

apiSuccess([
	'messages_deleted' => count($deletableIds),
	'message_ids' => $deletableIds,
	'files_deleted' => $filesDeleted,
]);
