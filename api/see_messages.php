<?php
session_start();
require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/api_helpers.php';

apiRequireMethod('POST');
$userId = apiRequireAuth();

$body = apiGetJsonBody();
$messages_seen = $body['messages'] ?? null;

if (!$messages_seen) {
    apiError('MISSING_MESSAGES', 'No messages specified!', 400);
}

// Validate that all message IDs are integers
$messages_seen = array_filter($messages_seen, 'is_numeric');
$messages_seen = array_map('intval', $messages_seen);

if (empty($messages_seen)) {
    apiError('INVALID_MESSAGES', 'No valid message IDs provided!', 400);
}

$placeholders = implode(',', array_fill(0, count($messages_seen), '?'));
$stmt = $pdo->prepare("UPDATE messages SET seen_at = NOW() WHERE id IN ($placeholders) AND receiver_id=?");
$params = array_merge($messages_seen, [$userId]);
if (!$stmt->execute($params)) {
    apiError('UPDATE_FAILED', 'Could not mark these messages as seen!', 409);
}

apiSuccess(['messages_seen' => count($messages_seen)]);