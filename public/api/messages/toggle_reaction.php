<?php
session_start();

require_once __DIR__ . '/../../../tintin-core/includes/db.php';
require_once __DIR__ . '/../../../tintin-core/includes/api_helpers.php';
require_once __DIR__ . '/../../../tintin-core/includes/group_helpers.php';
require_once __DIR__ . '/../../../tintin-core/includes/reaction_helpers.php';

apiRequireMethod('POST');
$userId = apiRequireAuth();
apiRequireCsrf();
session_write_close();

$body = apiGetJsonBody();
$messageId = isset($body['message_id']) ? (int) $body['message_id'] : 0;
$reactionInput = trim((string) ($body['reaction'] ?? ''));
$reactionCode = ttcReactionCodeFromInput($reactionInput);

if ($messageId <= 0) {
	apiError('INVALID_MESSAGE_ID', 'Invalid message id', 400);
}

if ($reactionInput !== '' && $reactionCode === '') {
	apiError('INVALID_REACTION', 'Unsupported reaction', 400);
}

$msgStmt = $pdo->prepare('SELECT id, sender_id, receiver_id, group_id FROM messages WHERE id = ? LIMIT 1');
$msgStmt->execute([$messageId]);
$message = $msgStmt->fetch(PDO::FETCH_ASSOC);

if (!$message) {
	apiError('MESSAGE_NOT_FOUND', 'Message not found', 404);
}

$groupId = isset($message['group_id']) ? (int) $message['group_id'] : 0;
if ($groupId > 0) {
	groupRequireMembership($pdo, $groupId, $userId);
} else {
	$senderId = isset($message['sender_id']) ? (int) $message['sender_id'] : 0;
	$receiverId = isset($message['receiver_id']) ? (int) $message['receiver_id'] : 0;
	if ($senderId !== $userId && $receiverId !== $userId) {
		apiError('FORBIDDEN', 'You cannot react to this message', 403);
	}
}

if ($reactionCode === '') {
	$deleteStmt = $pdo->prepare('DELETE FROM message_reactions WHERE message_id = ? AND user_id = ?');
	$deleteStmt->execute([$messageId, $userId]);
} else {
	$upsertStmt = $pdo->prepare(
		'INSERT INTO message_reactions (message_id, user_id, reaction)
		 VALUES (?, ?, ?)
		 ON DUPLICATE KEY UPDATE reaction = VALUES(reaction), updated_at = CURRENT_TIMESTAMP'
	);
	$upsertStmt->execute([$messageId, $userId, $reactionCode]);
}

$reactionStmt = $pdo->prepare(
	'SELECT reaction, user_id
	 FROM message_reactions
	 WHERE message_id = ?'
);
$reactionStmt->execute([$messageId]);
$reactionRows = $reactionStmt->fetchAll(PDO::FETCH_ASSOC);

$summaryMap = [];
foreach ($reactionRows as $row) {
	$emoji = ttcReactionEmojiFromStorage((string) ($row['reaction'] ?? ''));
	if ($emoji === '') {
		continue;
	}
	if (!isset($summaryMap[$emoji])) {
		$summaryMap[$emoji] = [
			'emoji' => $emoji,
			'count' => 0,
			'reacted_by_me' => false,
		];
	}
	$summaryMap[$emoji]['count']++;
	if ((int) ($row['user_id'] ?? 0) === $userId) {
		$summaryMap[$emoji]['reacted_by_me'] = true;
	}
}

apiSuccess([
	'message_id' => $messageId,
	'reactions' => array_values($summaryMap),
]);
