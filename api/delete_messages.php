<?php
session_start();
require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/api_helpers.php';

apiRequireMethod('DELETE');
$userId = apiRequireAuth();

$data = apiGetJsonBody();
$messages = isset($data['messages']) ? $data['messages'] : (is_array($data) ? $data : null);

if (!$messages || !is_array($messages)) {
    apiError('MISSING_MESSAGES', 'No messages specified!', 400);
}

// Validate that all message IDs are integers
$messages = array_filter($messages, 'is_numeric');
$messages = array_map('intval', $messages);

if (empty($messages)) {
    apiError('INVALID_MESSAGES', 'No valid message IDs provided!', 400);
}

$placeholders = implode(',', array_fill(0, count($messages), '?'));
$stmt = $pdo->prepare("DELETE FROM messages WHERE id IN ($placeholders) AND (receiver_id=? OR sender_id=?)");
$params = array_merge($messages, [$userId, $userId]);
if (!$stmt->execute($params)) {
    apiError('DELETE_FAILED', 'Could not delete the messages!', 409);
}

apiSuccess(['messages_deleted' => count($messages)]);