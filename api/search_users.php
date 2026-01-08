<?php
session_start();
require_once '../includes/db.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

if (!isset($_GET['query']) || strlen(trim($_GET['query'])) < 3) {
    echo json_encode(['users' => []]);
    exit;
}

$query = trim($_GET['query']);
$currentUserId = $_SESSION['user_id'];

try {
    $stmt = $pdo->prepare("
        SELECT username 
        FROM users 
        WHERE LOWER(username) LIKE LOWER(?) 
        AND id != ? 
        ORDER BY username 
        LIMIT 10
    ");
    
    $searchPattern = '%' . $query . '%';
    $stmt->execute([$searchPattern, $currentUserId]);
    
    $users = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    echo json_encode(['users' => $users]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error']);
}
?>