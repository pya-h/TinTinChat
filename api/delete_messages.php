<?php
session_start();
require_once __DIR__ . '/../includes/db.php';

header('Content-Type: application/json');

if(!isset($_SERVER['REQUEST_METHOD']) || $_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(404);
    echo json_encode(['status' => 'failed', 'error' => 'Invalid endpoint!']);
    exit;
}
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['status' => 'failed', 'error' => 'Not logged in']);
    exit;
}

$userId = $_SESSION['user_id'];
$raw_data = file_get_contents('php://input');
if (!$raw_data) {
    http_response_code(400);
    echo json_encode(['status' => 'failed', 'error' => 'No messages specified!']);
    exit;
}

$data = json_decode($raw_data, true);
$messages = isset($data['messages']) ? $data['messages'] : (is_array($data) ? $data : null);

if (!$messages || !is_array($messages)) {
    http_response_code(400);
    echo json_encode(['status' => 'failed', 'error' => 'No messages specified!']);
    exit;
}

// Validate that all message IDs are integers
$messages = array_filter($messages, 'is_numeric');
$messages = array_map('intval', $messages);

if (empty($messages)) {
    http_response_code(400);
    echo json_encode(['status' => 'failed', 'error' => 'No valid message IDs provided!']);
    exit;
}

$placeholders = implode(',', array_fill(0, count($messages), '?'));
$stmt = $pdo->prepare("DELETE FROM messages WHERE id IN ($placeholders) AND (receiver_id=? OR sender_id=?)");
$params = array_merge($messages, [$userId, $userId]);
if (!$stmt->execute($params)) {
    http_response_code(409);
    echo json_encode(['status' => 'failed', 'error' => 'Could not delete the messages!']);
    exit;
}

echo json_encode(['status' => 'ok', 'messages_deleted' => count($messages)]);