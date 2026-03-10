<?php
session_start();

require_once __DIR__ . '/../../../includes/db.php';
require_once __DIR__ . '/../../../includes/api_helpers.php';

apiRequireMethod('GET');
apiRequireAuth();

$stickerId = isset($_GET['id']) ? (int) $_GET['id'] : 0;
if ($stickerId <= 0) {
	http_response_code(400);
	exit('Bad Request');
}

$stmt = $pdo->prepare('SELECT file_path, file_mime, is_active FROM stickers WHERE id = ? LIMIT 1');
$stmt->execute([$stickerId]);
$sticker = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$sticker || (int) ($sticker['is_active'] ?? 0) !== 1) {
	http_response_code(404);
	exit('Not Found');
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
