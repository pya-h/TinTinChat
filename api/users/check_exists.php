<?php
session_start();
require_once __DIR__ . '/../../includes/db.php';
require_once __DIR__ . '/../../includes/api_helpers.php';

apiRequireMethod('GET');
apiRequireAuth();

$username = trim($_GET['username'] ?? '');

if (!$username) {
	apiError('MISSING_USERNAME', 'Missing username parameter', 400);
}

if (!preg_match('/^[a-zA-Z][a-zA-Z0-9_-]{2,}$/', $username)) {
	apiError('INVALID_USERNAME', 'Invalid username format', 400);
}

try {
	$stmt = $pdo->prepare("SELECT id FROM users WHERE username = ?");
	$stmt->execute([$username]);
	$user = $stmt->fetch();
    
	apiSuccess([
		'exists' => $user !== false,
		'username' => $username
	]);
} catch (PDOException $e) {
	apiError('DB_ERROR', 'Database error', 500);
}
