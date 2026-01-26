<?php
session_start();
require_once __DIR__ . '/../includes/db.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['status' => 'failed', 'error' => 'Not logged in']);
    exit;
}
// FIXME: Checkout Post bodies on all endpoints
// TODO: Also check all update/insert queries results and return error on failures.

$userId = $_SESSION['user_id'];
$target = $_POST['target'] ?? '';
$messageEncryptedForRecipient = $_POST['message'] ?? '';
$messageEncryptedForSender = $_POST['message_for_sender'] ?? '';

if (!$target || !$messageEncryptedForRecipient || !$messageEncryptedForSender) {
    http_response_code(400);
    echo json_encode(['status' => 'failed', 'error' => 'Missing parameters']);
    exit;
}

$stmt = $pdo->prepare('SELECT id FROM users WHERE username = ?');
$stmt->execute([$target]);
$targetUser = $stmt->fetch();

if (!$targetUser) {
    http_response_code(404);
    echo json_encode(['status' => 'failed', 'error' => 'Target user not found']);
    exit;
}

$stmt = $pdo->prepare("INSERT INTO messages (sender_id, receiver_id, message, message_for_sender, message_type) VALUES (?, ?, ?, ?, 'text')");
if (
    !$stmt->execute([
        $userId,
        $targetUser['id'],
        $messageEncryptedForRecipient,
        $messageEncryptedForSender,
    ])
) {
    http_response_code(409);
    echo json_encode(['status' => 'failed', 'error' => 'Something went wrong while sending your message!']);
    exit;
}

$messageId = $pdo->lastInsertId();

echo json_encode(['status' => 'ok', 'message_id' => $messageId]);
