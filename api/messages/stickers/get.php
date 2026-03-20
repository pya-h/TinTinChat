<?php
session_start();

require_once __DIR__ . '/../../../includes/db.php';
require_once __DIR__ . '/../../../includes/api_helpers.php';

apiRequireMethod('GET');
$userId = apiRequireAuth();
session_write_close();
$isAdmin = apiIsAdminUser($pdo, $userId);

$stickerId = isset($_GET['id']) ? (int) $_GET['id'] : 0;
if ($stickerId <= 0) {
	http_response_code(400);
	exit('Bad Request');
}

$columns = apiGetTableColumns($pdo, 'stickers');
if (empty($columns) || !isset($columns['file_path'])) {
	http_response_code(500);
	exit('Stickers schema unavailable');
}

$selectParts = ['file_path'];
$selectParts[] = isset($columns['file_mime']) ? 'file_mime' : "'image/png' AS file_mime";
if (isset($columns['is_active'])) {
	$selectParts[] = 'is_active';
}
if (isset($columns['is_admin_only'])) {
	$selectParts[] = 'is_admin_only';
}
if (isset($columns['uploaded_by_user_id'])) {
	$selectParts[] = 'uploaded_by_user_id';
}

$stmt = $pdo->prepare('SELECT ' . implode(', ', $selectParts) . ' FROM stickers WHERE id = ? LIMIT 1');
$stmt->execute([$stickerId]);
$sticker = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$sticker || (isset($columns['is_active']) && (int) ($sticker['is_active'] ?? 0) !== 1)) {
	http_response_code(404);
	exit('Not Found');
}

$isAdminOnly = isset($columns['is_admin_only']) && (int) ($sticker['is_admin_only'] ?? 0) === 1;
if ($isAdminOnly && !$isAdmin) {
	$uploadedByUserId = isset($columns['uploaded_by_user_id']) ? (int) ($sticker['uploaded_by_user_id'] ?? 0) : 0;
	if ($uploadedByUserId <= 0 || $uploadedByUserId !== $userId) {
		http_response_code(404);
		exit('Not Found');
	}
}

$relativePath = (string) ($sticker['file_path'] ?? '');
$uploadsBaseDir = realpath(__DIR__ . '/../../../uploads/stickers');
$absolutePath = realpath(__DIR__ . '/../../../' . $relativePath);

if (!$uploadsBaseDir || !$absolutePath || strpos($absolutePath, $uploadsBaseDir) !== 0 || !is_file($absolutePath)) {
	http_response_code(404);
	exit('Not Found');
}

$mime = (string) ($sticker['file_mime'] ?? 'image/webp');
if ($mime !== 'image/webp' && $mime !== 'image/png') {
	$mime = 'image/webp';
}

header('X-Content-Type-Options: nosniff');
header('Cache-Control: private, max-age=86400');
header('Content-Type: ' . $mime);
header('Content-Length: ' . filesize($absolutePath));
readfile($absolutePath);
exit;
