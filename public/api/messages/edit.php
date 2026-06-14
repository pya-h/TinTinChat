<?php
session_start();
require_once __DIR__ . '/../../../tintin-core/includes/db.php';
require_once __DIR__ . '/../../../tintin-core/includes/constants.php';
require_once __DIR__ . '/../../../tintin-core/includes/api_helpers.php';

apiRequireMethod('POST');
$userId = apiRequireAuth();
apiRequireCsrf();
session_write_close();

$data = apiGetJsonBody();
$messageId = isset($data['message_id']) && is_numeric($data['message_id'])
    ? (int) $data['message_id']
    : 0;
$messageEncryptedForRecipient = isset($data['message']) ? trim((string) $data['message']) : '';
$messageEncryptedForSender = isset($data['message_for_sender']) ? trim((string) $data['message_for_sender']) : '';

if ($messageId <= 0) {
    apiError('INVALID_MESSAGE_ID', 'Invalid message id.', 400);
}

if ($messageEncryptedForRecipient === '' || $messageEncryptedForSender === '') {
    apiError('MISSING_PARAMETERS', 'Missing parameters', 400);
}

$accessStmt = $pdo->prepare(
    'SELECT id, sender_id, message_type, created_at, TIMESTAMPDIFF(SECOND, created_at, NOW()) AS age_seconds
     FROM messages
     WHERE id = ?
     LIMIT 1'
);
$accessStmt->execute([$messageId]);
$messageRow = $accessStmt->fetch(PDO::FETCH_ASSOC);

if (!$messageRow) {
    apiError('MESSAGE_NOT_FOUND', 'Message not found', 404);
}

if ((int) $messageRow['sender_id'] !== $userId) {
    apiError('FORBIDDEN', 'You are not allowed to edit this message.', 403);
}

if (trim((string) $messageRow['message_type']) !== 'text') {
    apiError('EDIT_UNSUPPORTED_TYPE', 'Only text messages can be edited.', 400);
}

$ageSeconds = (int) ($messageRow['age_seconds'] ?? PHP_INT_MAX);
if ($ageSeconds > TTC_MESSAGE_EDIT_WINDOW_SECONDS) {
    apiError('EDIT_WINDOW_EXPIRED', 'Edit time window has expired.', 409);
}

$updateStmt = $pdo->prepare(
    'UPDATE messages
     SET message = ?, message_for_sender = ?, edited_at = NOW()
     WHERE id = ? AND sender_id = ?
     LIMIT 1'
);
$updated = $updateStmt->execute([
    $messageEncryptedForRecipient,
    $messageEncryptedForSender,
    $messageId,
    $userId,
]);

if (!$updated) {
    apiError('DB_ERROR', 'Unable to edit message.', 500);
}

$fetchStmt = $pdo->prepare('SELECT edited_at FROM messages WHERE id = ? LIMIT 1');
$fetchStmt->execute([$messageId]);
$editedAt = (string) ($fetchStmt->fetchColumn() ?: '');

apiSuccess([
    'message_id' => $messageId,
    'edited_at' => $editedAt,
]);
