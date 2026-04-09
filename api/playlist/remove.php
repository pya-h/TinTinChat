<?php
session_start();
require_once __DIR__ . '/../../includes/db.php';
require_once __DIR__ . '/../../includes/api_helpers.php';

apiRequireMethod('POST');
$userId = apiRequireAuth();
apiRequireCsrf();
session_write_close();

$body = apiGetJsonBody();
$messageId = (int) ($body['message_id'] ?? 0);

if ($messageId <= 0) {
    apiError('INVALID_MESSAGE_ID', 'Invalid message ID', 400);
}

$stmt = $pdo->prepare('DELETE FROM playlist_tracks WHERE user_id = ? AND message_id = ?');
$stmt->execute([$userId, $messageId]);

apiSuccess();
