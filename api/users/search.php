<?php
session_start();
require_once __DIR__ . '/../../includes/db.php';
require_once __DIR__ . '/../../includes/api_helpers.php';

apiRequireMethod('GET');
$currentUserId = apiRequireAuth();

if (!isset($_GET['query']) || strlen(trim($_GET['query'])) < TTC_SEARCH_USERS_MIN_QUERY_LENGTH) {
	apiSuccess(['users' => []]);
}

$query = trim($_GET['query']);

try {
	$stmt = $pdo->prepare("
		SELECT username 
		FROM users 
		WHERE LOWER(username) LIKE LOWER(?) 
		AND id != ? 
		ORDER BY username 
		LIMIT " . (int) TTC_SEARCH_USERS_LIMIT . "
	");
    
	$escapedQuery = addcslashes($query, '%_\\');
	$searchPattern = '%' . $escapedQuery . '%';
	$stmt->execute([$searchPattern, $currentUserId]);
    
	$users = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
	apiSuccess(['users' => $users]);
    
} catch (PDOException $e) {
	apiError('DB_ERROR', 'Database error', 500);
}
