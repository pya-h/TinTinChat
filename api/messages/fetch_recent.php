<?php
session_start();
require_once __DIR__ . '/../../includes/db.php';
require_once __DIR__ . '/../../includes/api_helpers.php';
require_once __DIR__ . '/../../includes/group_helpers.php';
require_once __DIR__ . '/../../includes/reaction_helpers.php';

apiRequireMethod('GET');
$user_id = apiRequireAuth();
session_write_close();
$groupId = groupParseId($_GET['group_id'] ?? null);
$other_username = $groupId > 0 ? '' : apiNormalizeUsername($_GET['with'] ?? '', 'INVALID_TARGET_USERNAME');

if(!isset($_GET['offsetMsgId'])) {
	apiError('MISSING_OFFSET', 'Cannot fetch recent messages without specifying the offset message', 400);
}

$other_user_id = 0;
if ($groupId > 0) {
	groupRequireMembership($pdo, $groupId, $user_id);
	groupMarkMessagesSeenAndRead($pdo, $groupId, $user_id);
} else {
	$stmt = $pdo->prepare('SELECT id FROM users WHERE username = ? LIMIT 1');
	$stmt->execute([$other_username]);
	$other_user = $stmt->fetch();

	if (!$other_user) {
		apiError('TARGET_NOT_FOUND', 'Target user not found', 404);
	}
	$other_user_id = (int) $other_user['id'];
}
$last_msg_id = max(0, (int)$_GET['offsetMsgId']);
$editedSince = isset($_GET['editedSince']) ? trim((string)$_GET['editedSince']) : '';

if ($groupId > 0) {
	$whereClause = 'm.group_id = ? AND (m.id > ?' . ($editedSince !== '' ? ' OR (m.edited_at > ? AND m.id <= ?)' : '') . ')';
	$params = $editedSince !== ''
		? [$groupId, $last_msg_id, $editedSince, $last_msg_id]
		: [$groupId, $last_msg_id];
} else {
	$chatFilter = '((m.sender_id = ? AND m.receiver_id = ?) OR (m.sender_id = ? AND m.receiver_id = ?))';
	$whereClause = $chatFilter . ' AND (m.id > ?' . ($editedSince !== '' ? ' OR (m.edited_at > ? AND m.id <= ?)' : '') . ')';
	$params = $editedSince !== ''
		? [$user_id, $other_user_id, $other_user_id, $user_id, $last_msg_id, $editedSince, $last_msg_id]
		: [$user_id, $other_user_id, $other_user_id, $user_id, $last_msg_id];
}

$stmt = $pdo->prepare("SELECT m.id, m.sender_id, m.receiver_id, m.group_id, m.message, m.message_for_sender, m.message_type, m.voice_file_path, m.image_file_path, m.any_file_path, m.file_purged_at, m.file_size, m.sticker_id, m.reply_to_message_id, m.forwarded_from_message_id, m.forwarded_by_user_id, m.grouped_with, m.created_at, m.edited_at, m.seen_at, m.group_seen_at, m.group_seen_by_user_id,
	s.width AS sticker_width,
	s.height AS sticker_height,
	s.file_mime AS sticker_mime,
	s.is_active AS sticker_is_active,
	su.username AS sender_username,
	gsu.username AS group_seen_by_username,
	r.id AS reply_message_id,
	r.sender_id AS reply_sender_id,
	r.message AS reply_message,
	r.message_for_sender AS reply_message_for_sender,
	r.message_type AS reply_message_type,
	rsu.username AS reply_sender_username,
	fu.username AS forwarded_by_username,
	fmu.username AS forwarded_original_sender_username
	FROM messages m
	LEFT JOIN users su ON su.id = m.sender_id
	LEFT JOIN messages r ON r.id = m.reply_to_message_id
	LEFT JOIN users rsu ON rsu.id = r.sender_id
	LEFT JOIN users fu ON fu.id = m.forwarded_by_user_id
	LEFT JOIN messages fm ON fm.id = m.forwarded_from_message_id
	LEFT JOIN users fmu ON fmu.id = fm.sender_id
	LEFT JOIN users gsu ON gsu.id = m.group_seen_by_user_id
	LEFT JOIN stickers s ON s.id = m.sticker_id
	WHERE $whereClause ORDER BY m.created_at ASC LIMIT 200");
$stmt->execute($params);
$messages = $stmt->fetchAll(PDO::FETCH_ASSOC);

if (!empty($messages)) {
	$messageIds = array_values(array_filter(array_map(static function ($row) {
		return isset($row['id']) ? (int) $row['id'] : 0;
	}, $messages), static function ($id) {
		return $id > 0;
	}));

	if (!empty($messageIds)) {
		$placeholders = implode(',', array_fill(0, count($messageIds), '?'));
		$reactionStmt = $pdo->prepare(
			"SELECT message_id, reaction, user_id
			 FROM message_reactions
			 WHERE message_id IN ($placeholders)"
		);
		$reactionStmt->execute($messageIds);
		$reactionRows = $reactionStmt->fetchAll(PDO::FETCH_ASSOC);

		$reactionsByMessage = [];
		foreach ($reactionRows as $reactionRow) {
			$messageId = isset($reactionRow['message_id']) ? (int) $reactionRow['message_id'] : 0;
			$emoji = ttcReactionEmojiFromStorage((string) ($reactionRow['reaction'] ?? ''));
			if ($messageId <= 0 || $emoji === '') {
				continue;
			}
			if (!isset($reactionsByMessage[$messageId])) {
				$reactionsByMessage[$messageId] = [];
			}
			if (!isset($reactionsByMessage[$messageId][$emoji])) {
				$reactionsByMessage[$messageId][$emoji] = [
					'emoji' => $emoji,
					'count' => 0,
					'reacted_by_me' => false,
				];
			}
			$reactionsByMessage[$messageId][$emoji]['count']++;
			if ((int) ($reactionRow['user_id'] ?? 0) === $user_id) {
				$reactionsByMessage[$messageId][$emoji]['reacted_by_me'] = true;
			}
		}

		foreach ($messages as &$messageRow) {
			$mid = isset($messageRow['id']) ? (int) $messageRow['id'] : 0;
			$messageRow['reactions'] = $mid > 0 && isset($reactionsByMessage[$mid])
				? array_values($reactionsByMessage[$mid])
				: [];
		}
		unset($messageRow);
	}
}
// ── Inline typing status (saves a separate /typing/fetch.php round-trip) ──
$typingData = ['is_typing' => false, 'typers' => []];
try {
	if ($groupId > 0) {
		$typStmt = $pdo->prepare(
			'SELECT u.username
			 FROM group_typing_status gts
			 INNER JOIN users u ON u.id = gts.typer_user_id
			 WHERE gts.group_id = ?
			   AND gts.typer_user_id <> ?
			   AND gts.is_typing = 1
			   AND gts.updated_at >= (NOW() - INTERVAL 8 SECOND)
			 ORDER BY gts.updated_at DESC'
		);
		$typStmt->execute([$groupId, $user_id]);
		$typers = [];
		foreach ($typStmt->fetchAll(PDO::FETCH_ASSOC) as $tRow) {
			$tName = trim((string) ($tRow['username'] ?? ''));
			if ($tName !== '') $typers[] = $tName;
		}
		$typingData = [
			'is_typing' => count($typers) > 0,
			'typers' => $typers,
			'scope' => 'group',
			'group_id' => $groupId,
		];
	} else {
		$typStmt = $pdo->prepare(
			'SELECT is_typing, updated_at
			 FROM chat_typing_status
			 WHERE typer_user_id = ? AND target_user_id = ?
			 LIMIT 1'
		);
		$typStmt->execute([$other_user_id, $user_id]);
		$typRow = $typStmt->fetch(PDO::FETCH_ASSOC);
		if ($typRow) {
			$isTyping = (int) ($typRow['is_typing'] ?? 0) === 1;
			$updatedAt = isset($typRow['updated_at']) ? strtotime((string) $typRow['updated_at']) : false;
			$isFresh = $updatedAt !== false && $updatedAt >= (time() - 8);
			$typingData['is_typing'] = $isTyping && $isFresh;
		}
	}
} catch (Throwable $ex) {
	// Typing status is non-critical; silently ignore errors
}

// Keep the polling watermark on the same time source as message timestamps (DB)
$serverTime = (string) ($pdo->query('SELECT NOW()')->fetchColumn() ?: date('Y-m-d H:i:s'));

apiSuccess([
	'messages' => $messages,
	'typing' => $typingData,
	'server_time' => $serverTime,
]);
