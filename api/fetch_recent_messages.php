<?php
session_start();
require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/api_helpers.php';
require_once __DIR__ . '/../includes/group_helpers.php';

apiRequireMethod('GET');
$user_id = apiRequireAuth();
$groupId = groupParseId($_GET['group_id'] ?? null);
$other_username = $groupId > 0 ? '' : apiNormalizeUsername($_GET['with'] ?? '', 'INVALID_TARGET_USERNAME');

if(!isset($_GET['offsetMsgId'])) {
  apiError('MISSING_OFFSET', 'Cannot fetch recent messages without specifying the offset message', 400);
}

$other_user_id = 0;
if ($groupId > 0) {
  groupRequireMembership($pdo, $groupId, $user_id);
} else {
  $stmt = $pdo->prepare('SELECT id FROM users WHERE username = ?');
  $stmt->execute([$other_username]);
  $other_user = $stmt->fetch();

  if (!$other_user) {
    apiError('TARGET_NOT_FOUND', 'Target user not found', 404);
  }
  $other_user_id = (int) $other_user['id'];
}
$last_msg_id = max(0, (int)$_GET['offsetMsgId']);

$whereClause = $groupId > 0
  ? 'm.group_id = ? AND m.id > ?'
  : '((m.sender_id = ? AND m.receiver_id = ?) OR (m.sender_id = ? AND m.receiver_id = ?)) AND m.id > ?';
$params = $groupId > 0
  ? [$groupId, $last_msg_id]
  : [$user_id, $other_user_id, $other_user_id, $user_id, $last_msg_id];

$stmt = $pdo->prepare("SELECT m.id, m.sender_id, m.receiver_id, m.group_id, m.message, m.message_for_sender, m.message_type, m.voice_file_path, m.image_file_path, m.any_file_path, m.file_size, m.sticker_id, m.reply_to_message_id, m.forwarded_from_message_id, m.forwarded_by_user_id, m.created_at, m.seen_at,
  s.width AS sticker_width,
  s.height AS sticker_height,
  s.file_mime AS sticker_mime,
  s.is_active AS sticker_is_active,
  su.username AS sender_username,
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
  LEFT JOIN stickers s ON s.id = m.sticker_id
  WHERE $whereClause ORDER BY m.created_at ASC");
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
      $emoji = isset($reactionRow['reaction']) ? trim((string) $reactionRow['reaction']) : '';
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
apiSuccess([
  'messages' => $messages,
]);