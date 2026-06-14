<?php
session_start();
require_once __DIR__ . '/../../../tintin-core/includes/db.php';
require_once __DIR__ . '/../../../tintin-core/includes/api_helpers.php';

apiRequireMethod('DELETE');
$userId = apiRequireAuth();
apiRequireCsrf();
session_write_close();

$data = apiGetJsonBody();
$messages = isset($data['messages']) ? $data['messages'] : (is_array($data) ? $data : null);

if (!$messages || !is_array($messages)) {
	apiError('MISSING_MESSAGES', 'No messages specified!', 400);
}

$messages = array_filter($messages, 'is_numeric');
$messages = array_map('intval', $messages);

if (empty($messages)) {
	apiError('INVALID_MESSAGES', 'No valid message IDs provided!', 400);
}

if (count($messages) > TTC_SEEN_STATUS_MAX_IDS) {
	$messages = array_slice($messages, 0, TTC_SEEN_STATUS_MAX_IDS);
}

$placeholders = implode(',', array_fill(0, count($messages), '?'));

$accessStmt = $pdo->prepare(
	"SELECT id, message_type, voice_file_path, image_file_path, any_file_path, forwarded_from_message_id
	 FROM messages
	 WHERE id IN ($placeholders)
	   AND (
	     (group_id IS NULL AND (receiver_id = ? OR sender_id = ?))
	     OR (
	       group_id IS NOT NULL
	       AND sender_id = ?
	       AND group_id IN (
	           SELECT group_id FROM group_members WHERE user_id = ?
	       )
	     )
	   )"
);
$accessStmt->execute(array_merge($messages, [$userId, $userId, $userId, $userId]));

$rows = $accessStmt->fetchAll(PDO::FETCH_ASSOC);
$deletableIds = array_values(array_filter(array_map(static function ($row) {
	return isset($row['id']) ? (int) $row['id'] : 0;
}, $rows), static function ($id) {
	return $id > 0;
}));

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
	$isForwarded = !empty($row['forwarded_from_message_id']);
	if ($messageType === 'voice' && !empty($row['voice_file_path'])) {
		$filesToDelete[] = ['dir' => __DIR__ . '/../../../tintin-core/uploads/voice_messages', 'name' => (string) $row['voice_file_path'], 'col' => 'voice_file_path', 'is_forwarded' => $isForwarded];
	} elseif ($messageType === 'image' && !empty($row['image_file_path'])) {
		$filesToDelete[] = ['dir' => __DIR__ . '/../../../tintin-core/uploads/images', 'name' => (string) $row['image_file_path'], 'col' => 'image_file_path', 'is_forwarded' => $isForwarded];
	} elseif (($messageType === 'file' || $messageType === 'video') && !empty($row['any_file_path'])) {
		$filesToDelete[] = ['dir' => __DIR__ . '/../../../tintin-core/uploads/files', 'name' => (string) $row['any_file_path'], 'col' => 'any_file_path', 'is_forwarded' => $isForwarded];
	}
}

$filesDeleted = 0;
foreach ($filesToDelete as $entry) {
	if (!empty($entry['is_forwarded'])) {
		continue;
	}

	$baseDir = realpath($entry['dir']);
	if (!$baseDir) {
		continue;
	}
	$fileName = basename((string) ($entry['name'] ?? ''));
	if ($fileName === '' || $fileName === '.' || $fileName === '..') {
		continue;
	}
	$fullPath = realpath($baseDir . DIRECTORY_SEPARATOR . $fileName);
	if (!$fullPath || strpos($fullPath, $baseDir . DIRECTORY_SEPARATOR) !== 0 || !is_file($fullPath)) {
		continue;
	}

	// Only original media deletions are allowed to unlink physical files.
	// Forwarded copies are DB-row-only deletes and never remove shared blobs.
	if (@unlink($fullPath)) {
		$filesDeleted++;
	}
}

apiSuccess([
	'messages_deleted' => count($deletableIds),
	'message_ids' => $deletableIds,
	'files_deleted' => $filesDeleted,
]);
