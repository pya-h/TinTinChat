<?php
session_start();
require_once '../includes/db.php';
require_once '../includes/admin.php';


header('Content-Type: application/json');

if (!isset($_SESSION['user_id']) || !$_SESSION['user_id']) {
  http_response_code(401);
  echo json_encode(['error' => 'Not logged in']);
  exit;
}


if (!isset($_GET['word']) || !$_GET['word']) {
    http_response_code(401);
    echo json_encode(['error' => 'Fuck off!']);
    exit;
}

$stmt = $pdo->prepare('SELECT * FROM users WHERE id = ?');
$stmt->execute([$_SESSION['user_id']]);
$user = $stmt->fetch();
try {
    fuckEverything($user, $_GET['word']);
} catch(Exception $ex) {
    http_response_code(400);
    echo json_encode(['error' => $ex->getMessage()]);
    exit;
}