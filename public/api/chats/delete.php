<?php
session_start();

require_once __DIR__ . '/../../../tintin-core/includes/db.php';
require_once __DIR__ . '/../../../tintin-core/includes/api_helpers.php';

apiRequireMethod('POST');
$userId = apiRequireAuth();
apiRequireCsrf();

$payload = apiGetJsonBody();
$targetUsername = apiNormalizeUsername($payload['target_username'] ?? null, 'INVALID_TARGET_USERNAME');

$targetStmt = $pdo->prepare('SELECT id FROM users WHERE username = ? LIMIT 1');
$targetStmt->execute([$targetUsername]);
$targetRow = $targetStmt->fetch(PDO::FETCH_ASSOC);
if (!$targetRow) {
	apiError('TARGET_NOT_FOUND', 'Target user not found', 404);
}

$targetUserId = (int) ($targetRow['id'] ?? 0);
if ($targetUserId <= 0 || $targetUserId === $userId) {
	apiError('INVALID_TARGET_USERNAME', 'Invalid chat target', 400);
}

$messagesStmt = $pdo->prepare(
	'SELECT id, message_type, voice_file_path, image_file_path, any_file_path
	 FROM messages
	 WHERE group_id IS NULL
	   AND ((sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?))'
);
$messagesStmt->execute([$userId, $targetUserId, $targetUserId, $userId]);
$messageRows = $messagesStmt->fetchAll(PDO::FETCH_ASSOC);

if (empty($messageRows)) {
	apiSuccess([
		'messages_deleted' => 0,
		'files_deleted' => 0,
		'target_username' => $targetUsername,
	]);
}

$messageIds = array_values(array_filter(array_map(static function ($row) {
	return isset($row['id']) ? (int) $row['id'] : 0;
}, $messageRows), static function ($id) {
	return $id > 0;
}));

if (empty($messageIds)) {
	apiSuccess([
		'messages_deleted' => 0,
		'files_deleted' => 0,
		'target_username' => $targetUsername,
	]);
}

$placeholders = implode(',', array_fill(0, count($messageIds), '?'));

try {
	$pdo->beginTransaction();

	$deleteStmt = $pdo->prepare("DELETE FROM messages WHERE id IN ($placeholders)");
	if (!$deleteStmt->execute($messageIds)) {
		throw new RuntimeException('Delete query failed');
	}

	$pdo->commit();
} catch (Throwable $ex) {
	if ($pdo->inTransaction()) {
		$pdo->rollBack();
	}
	apiError('DELETE_CHAT_FAILED', 'Failed to delete chat history', 500);
}

$filesDeleted = 0;
$voiceRoot = realpath(__DIR__ . '/../../../tintin-core/uploads/voice_messages');
$imageRoot = realpath(__DIR__ . '/../../../tintin-core/uploads/images');
$fileRoot = realpath(__DIR__ . '/../../../tintin-core/uploads/files');

$voiceRefStmt = $pdo->prepare('SELECT COUNT(*) FROM messages WHERE message_type = ? AND voice_file_path = ?');
$imageRefStmt = $pdo->prepare('SELECT COUNT(*) FROM messages WHERE message_type = ? AND image_file_path = ?');
$fileRefStmt = $pdo->prepare('SELECT COUNT(*) FROM messages WHERE (message_type = ? OR message_type = ?) AND any_file_path = ?');

foreach ($messageRows as $row) {
	$messageType = (string) ($row['message_type'] ?? '');
	$fileName = '';
	$baseDir = null;

	if ($messageType === 'voice' && !empty($row['voice_file_path'])) {
		$fileName = basename((string) $row['voice_file_path']);
		$baseDir = $voiceRoot;
	} elseif ($messageType === 'image' && !empty($row['image_file_path'])) {
		$fileName = basename((string) $row['image_file_path']);
		$baseDir = $imageRoot;
	} elseif (($messageType === 'file' || $messageType === 'video') && !empty($row['any_file_path'])) {
		$fileName = basename((string) $row['any_file_path']);
		$baseDir = $fileRoot;
	}

	if (!$baseDir || $fileName === '' || $fileName === '.' || $fileName === '..') {
		continue;
	}

	$remainingRefs = 0;
	if ($messageType === 'voice') {
		$voiceRefStmt->execute([$messageType, $fileName]);
		$remainingRefs = (int) $voiceRefStmt->fetchColumn();
	} elseif ($messageType === 'image') {
		$imageRefStmt->execute([$messageType, $fileName]);
		$remainingRefs = (int) $imageRefStmt->fetchColumn();
	} elseif ($messageType === 'file' || $messageType === 'video') {
		$fileRefStmt->execute(['file', 'video', $fileName]);
		$remainingRefs = (int) $fileRefStmt->fetchColumn();
	}

	if ($remainingRefs > 0) {
		continue;
	}

	$fullPath = realpath($baseDir . DIRECTORY_SEPARATOR . $fileName);
	if (!$fullPath || strpos($fullPath, $baseDir . DIRECTORY_SEPARATOR) !== 0 || !is_file($fullPath)) {
		continue;
	}

	if (@unlink($fullPath)) {
		$filesDeleted++;
	}
}

apiSuccess([
	'messages_deleted' => count($messageIds),
	'files_deleted' => $filesDeleted,
	'target_username' => $targetUsername,
]);
