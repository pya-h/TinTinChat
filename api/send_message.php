<?php
session_start();
require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/api_helpers.php';

apiRequireMethod('POST');
$userId = apiRequireAuth();
apiRequireCsrf();
$target = $_POST['target'] ?? '';
$messageEncryptedForRecipient = $_POST['message'] ?? '';
$messageEncryptedForSender = $_POST['message_for_sender'] ?? '';
$replyToMessageId = isset($_POST['reply_to_message_id']) && is_numeric($_POST['reply_to_message_id'])
    ? (int) $_POST['reply_to_message_id']
    : null;
$forwardedFromMessageId = isset($_POST['forwarded_from_message_id']) && is_numeric($_POST['forwarded_from_message_id'])
    ? (int) $_POST['forwarded_from_message_id']
    : null;

if (!$target || !$messageEncryptedForRecipient || !$messageEncryptedForSender) {
    apiError('MISSING_PARAMETERS', 'Missing parameters', 400);
}

$stmt = $pdo->prepare('SELECT id FROM users WHERE username = ?');
$stmt->execute([$target]);
$targetUser = $stmt->fetch();

if (!$targetUser) {
    apiError('TARGET_NOT_FOUND', 'Target user not found', 404);
}

if ($replyToMessageId) {
    $replyStmt = $pdo->prepare(
        'SELECT id FROM messages WHERE id = ? AND ((sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)) LIMIT 1'
    );
    $replyStmt->execute([$replyToMessageId, $userId, $targetUser['id'], $targetUser['id'], $userId]);
    if (!$replyStmt->fetch()) {
        apiError('INVALID_REPLY_TARGET', 'Invalid reply target message', 400);
    }
}

if ($forwardedFromMessageId) {
    $forwardStmt = $pdo->prepare(
        'SELECT id FROM messages WHERE id = ? AND (sender_id = ? OR receiver_id = ?) LIMIT 1'
    );
    $forwardStmt->execute([$forwardedFromMessageId, $userId, $userId]);
    if (!$forwardStmt->fetch()) {
        apiError('INVALID_FORWARD_TARGET', 'Invalid forwarded source message', 400);
    }
}

$stmt = $pdo->prepare("INSERT INTO messages (sender_id, receiver_id, message, message_for_sender, message_type, reply_to_message_id, forwarded_from_message_id, forwarded_by_user_id) VALUES (?, ?, ?, ?, 'text', ?, ?, ?)");
if (
    !$stmt->execute([
        $userId,
        $targetUser['id'],
        $messageEncryptedForRecipient,
        $messageEncryptedForSender,
        $replyToMessageId,
        $forwardedFromMessageId,
        $forwardedFromMessageId ? $userId : null,
    ])
) {
    apiError('SEND_FAILED', 'Something went wrong while sending your message!', 409);
}

$messageId = $pdo->lastInsertId();

apiSuccess(['message_id' => $messageId]);
