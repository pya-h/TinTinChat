<?php
session_start();
require_once __DIR__ . '/../includes/db.php';

header('Content-Type: application/json');

$ident = $_GET['ident'];
$stmt = $pdo->prepare('SELECT id, username FROM users WHERE ident = ?');
$stmt->execute([$ident]);
$user = $stmt->fetch();

try {
    if (!$user) {
        throw new Exception($ident);
    }
    $generated_time = (int) explode('+', $ident)[0];
    if (time() - $generated_time > 48 * 60 * 60) {
        throw new Exception('Session expired!');
    }
} catch (Exception $ex) {
    http_response_code(401);
    echo json_encode(['error' => $ex->getMessage()]);
    exit;
}

$_SESSION['user_id'] = $user['id'];
$_SESSION['username'] = $user['username'];

echo json_encode(['result' => 'ok']);