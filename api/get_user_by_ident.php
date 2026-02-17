<?php
session_start();
require_once __DIR__ . '/../includes/db.php';

header('Content-Type: application/json');

$ident = isset($_GET['ident']) ? trim($_GET['ident']) : '';

if (!$ident || strlen($ident) < 10) {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid session token']);
    exit;
}

$stmt = $pdo->prepare('SELECT id, username FROM users WHERE ident = ?');
$stmt->execute([$ident]);
$user = $stmt->fetch();

try {
    if (!$user) {
        throw new Exception('Invalid session');
    }
    // Extract timestamp from ident: format is "<random_hex>.<timestamp>"
    $parts = explode('.', $ident);
    $generated_time = (int) end($parts);
    if (!$generated_time || time() - $generated_time > 48 * 60 * 60) {
        throw new Exception('Session expired!');
    }
} catch (Exception $ex) {
    http_response_code(401);
    echo json_encode(['error' => 'Session expired or invalid']);
    exit;
}

session_regenerate_id(true);
$_SESSION['user_id'] = $user['id'];
$_SESSION['username'] = $user['username'];

echo json_encode(['result' => 'ok']);