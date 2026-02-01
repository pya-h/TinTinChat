<?php
session_start();
require_once __DIR__ . '/../includes/db.php';

header('Content-Type: application/json');

if($_SERVER['REQUEST_METHOD'] != 'POST') {
    http_response_code(400);
    echo json_encode(['status' => 'failed', 'error' => 'Invalid Request!']);
    exit;
}
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['status' => 'failed', 'error' => 'Not logged in']);
    exit;
}

$userId = $_SESSION['user_id'];
if(!isset($_SERVER['REQUEST_METHOD']) || $_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(404);
    echo json_encode(['status' => 'failed', 'error' => 'Invalid endpoint!']);
    exit;
}
$body = file_get_contents('php://input');
if(!$body) {
    http_response_code(400);
    echo json_encode(['status' => 'failed', 'error' => 'No messages specified!']);
    exit;
}
$body = json_decode($body, true);
$messages_seen = isset($body['messages']) ? $body['messages'] : null;

if (!$messages_seen) {
    http_response_code(400);
    echo json_encode(['status' => 'failed', 'error' => 'No messages specified!']);
    exit;
}

$str_messages = implode(',', $messages_seen);
$stmt = $pdo->prepare("UPDATE messages SET seen_at = NOW() WHERE id in ($str_messages) AND receiver_id=?");
if (!$stmt->execute([$userId])) {
    http_response_code(409);
    echo json_encode(['status' => 'failed', 'error' => 'Could not mark these messages as seen!']);
    exit;
}

echo json_encode(['status' => 'ok', 'messages_seen' => count($messages_seen)]);