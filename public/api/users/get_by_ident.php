<?php
session_start();
require_once __DIR__ . '/../../../tintin-core/includes/db.php';
require_once __DIR__ . '/../../../tintin-core/includes/api_helpers.php';

apiRequireMethod('GET');

$ident = isset($_GET['ident']) ? trim($_GET['ident']) : '';

if (!$ident || strlen($ident) < 10) {
	apiError('INVALID_SESSION_TOKEN', 'Invalid session token', 401);
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
	apiError('SESSION_INVALID', 'Session expired or invalid', 401);
}

session_regenerate_id(true);
$_SESSION['user_id'] = $user['id'];
$_SESSION['username'] = $user['username'];
$newIdent = bin2hex(random_bytes(32)) . '.' . time();
$_SESSION['ident'] = $newIdent;

$updateStmt = $pdo->prepare('UPDATE users SET ident = ?, last_login = NOW() WHERE id = ?');
$updateStmt->execute([$newIdent, $user['id']]);

// Update session token in user_sessions table (swap old → new)
$swapStmt = $pdo->prepare('UPDATE user_sessions SET session_token = ?, last_active_at = NOW() WHERE session_token = ? AND user_id = ?');
$swapStmt->execute([$newIdent, $ident, (int)$user['id']]);

apiSuccess(['result' => 'ok']);
