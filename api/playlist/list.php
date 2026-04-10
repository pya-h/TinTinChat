<?php
session_start();
require_once __DIR__ . '/../../includes/db.php';
require_once __DIR__ . '/../../includes/api_helpers.php';
require_once __DIR__ . '/../../includes/group_helpers.php';

apiRequireMethod('GET');
$userId = apiRequireAuth();
session_write_close();

$stmt = $pdo->prepare(
    "SELECT
        pt.message_id,
        pt.title,
        pt.ext,
        pt.added_at,
        m.sender_id,
        m.receiver_id,
        m.group_id,
        m.message,
        m.message_for_sender,
        m.message_type,
        m.any_file_path,
        m.file_purged_at,
        m.file_size,
        su.username AS sender_username
     FROM playlist_tracks pt
     JOIN messages m ON m.id = pt.message_id
     LEFT JOIN users su ON su.id = m.sender_id
     WHERE pt.user_id = ?
     ORDER BY pt.added_at ASC"
);
$stmt->execute([$userId]);
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Collect receiver user IDs we need to resolve usernames for
$receiverIds = [];
foreach ($rows as $row) {
    $rid = (int) ($row['receiver_id'] ?? 0);
    if ($rid > 0 && $rid !== $userId) {
        $receiverIds[$rid] = true;
    }
}

// Batch-fetch receiver usernames
$receiverUsernames = [];
if ($receiverIds) {
    $placeholders = implode(',', array_fill(0, count($receiverIds), '?'));
    $uStmt = $pdo->prepare("SELECT id, username FROM users WHERE id IN ($placeholders)");
    $uStmt->execute(array_keys($receiverIds));
    foreach ($uStmt->fetchAll(PDO::FETCH_ASSOC) as $u) {
        $receiverUsernames[(int) $u['id']] = $u['username'];
    }
}

$items = [];
foreach ($rows as $row) {
    $groupId = (int) ($row['group_id'] ?? 0);
    $senderId = (int) ($row['sender_id'] ?? 0);
    $receiverId = (int) ($row['receiver_id'] ?? 0);

    // Derive chatTarget
    if ($groupId > 0) {
        $chatTarget = 'group:' . $groupId;
    } elseif ($senderId === $userId) {
        $chatTarget = $receiverUsernames[$receiverId] ?? '';
    } else {
        $chatTarget = $row['sender_username'] ?? '';
    }

    $items[] = [
        'message_id'         => (int) $row['message_id'],
        'chat_target'        => $chatTarget,
        'title'              => $row['title'] ?: 'Unknown',
        'ext'                => $row['ext'] ?: '',
        'added_at'           => $row['added_at'],
        'sender_id'          => $senderId,
        'receiver_id'        => $receiverId,
        'group_id'           => $groupId,
        'message'            => $row['message'],
        'message_for_sender' => $row['message_for_sender'],
        'message_type'       => $row['message_type'],
        'file_path'          => $row['any_file_path'] ?? '',
        'file_purged_at'     => $row['file_purged_at'],
        'file_size'          => $row['file_size'] !== null ? (int) $row['file_size'] : null,
    ];
}

apiSuccess([
    'items' => $items,
    'total' => count($items),
]);
