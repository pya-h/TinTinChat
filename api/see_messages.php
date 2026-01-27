<?php
session_start();
require_once __DIR__ . '/../includes/db.php';

header('Content-Type: application/json');

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
$messages_seen = $_POST['messages'] ?? null;

if (!$messages_seen) {
    http_response_code(400);
    echo json_encode(['status' => 'failed', 'error' => 'No messages specified!']);
    exit;
}

$stmt = $pdo->prepare("UPDATE messages SET seen_at = NOW() WHERE id IN ? AND receiver_id=?");
if (!$stmt->execute([$messages_seen, $userId])) {
    http_response_code(409);
    echo json_encode(['status' => 'failed', 'error' => 'Could not mark these messages as seen!']);
    exit;
}

echo json_encode(['status' => 'ok', 'messages_seen' => count($messages_seen)]);