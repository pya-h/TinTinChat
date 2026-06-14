<?php
require_once __DIR__ . '/../../../tintin-core/includes/session.php';
require_once __DIR__ . '/../../../tintin-core/includes/db.php';
require_once __DIR__ . '/../../../tintin-core/includes/auth.php';

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
	header('Location: ../../index.php');
	exit;
}

$csrfToken = isset($_POST['csrf_token']) ? (string) $_POST['csrf_token'] : '';
if (!verifyCsrfToken($csrfToken)) {
	header('Location: ../../index.php');
	exit;
}

logout();
exit;
