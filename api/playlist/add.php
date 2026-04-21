<?php
session_start();
require_once __DIR__ . '/../../includes/db.php';
require_once __DIR__ . '/../../includes/api_helpers.php';
require_once __DIR__ . '/../../includes/group_helpers.php';

apiRequireMethod('POST');
$userId = apiRequireAuth();
apiRequireCsrf();
session_write_close();

$body = apiGetJsonBody();
$messageId = (int) ($body['message_id'] ?? 0);
$title = trim((string) ($body['title'] ?? ''));
$ext = trim((string) ($body['ext'] ?? ''));

if ($messageId <= 0) {
    apiError('INVALID_MESSAGE_ID', 'Invalid message ID', 400);
}

if ($title === '') {
    $title = 'Unknown';
}
if (mb_strlen($title) > 255) {
    $title = mb_substr($title, 0, 255);
}
if (strlen($ext) > 16) {
    $ext = substr($ext, 0, 16);
}

$msgStmt = $pdo->prepare(
    'SELECT id, sender_id, receiver_id, group_id, message_type FROM messages WHERE id = ? LIMIT 1'
);
$msgStmt->execute([$messageId]);
$msg = $msgStmt->fetch(PDO::FETCH_ASSOC);

if (!$msg) {
    apiError('MESSAGE_NOT_FOUND', 'Message not found', 404);
}

if ($msg['message_type'] !== 'file') {
    apiError('NOT_A_FILE', 'Only file messages can be added to playlist', 400);
}

$groupId = (int) ($msg['group_id'] ?? 0);
$senderId = (int) ($msg['sender_id'] ?? 0);
$receiverId = (int) ($msg['receiver_id'] ?? 0);

if ($groupId > 0) {
    // Group message: user must be a member
    $memStmt = $pdo->prepare(
        'SELECT 1 FROM group_members WHERE group_id = ? AND user_id = ? LIMIT 1'
    );
    $memStmt->execute([$groupId, $userId]);
    if (!$memStmt->fetch()) {
        apiError('NOT_PARTICIPANT', 'You are not a member of this group', 403);
    }
} else {
    // Private message: user must be sender or receiver
    if ($senderId !== $userId && $receiverId !== $userId) {
        apiError('NOT_PARTICIPANT', 'You are not a participant in this conversation', 403);
    }
}

// Check 200-track limit
$countStmt = $pdo->prepare('SELECT COUNT(*) FROM playlist_tracks WHERE user_id = ?');
$countStmt->execute([$userId]);
if ((int) $countStmt->fetchColumn() >= 200) {
    apiError('PLAYLIST_FULL', 'Playlist full (200 tracks max)', 409);
}

$insStmt = $pdo->prepare(
    'INSERT IGNORE INTO playlist_tracks (user_id, message_id, title, ext) VALUES (?, ?, ?, ?)'
);
$insStmt->execute([$userId, $messageId, $title, $ext]);

if ($insStmt->rowCount() === 0) {
    apiError('ALREADY_IN_PLAYLIST', 'Already in playlist', 409);
}

apiSuccess([], 201);
