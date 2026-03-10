<?php
session_start();

require_once __DIR__ . '/../../includes/db.php';
require_once __DIR__ . '/../../includes/api_helpers.php';

apiRequireMethod('GET');
apiRequireAuth();

function avatarComputeInitials(string $username): string
{
	$trimmed = trim($username);
	if ($trimmed === '') {
		return 'U';
	}

	$parts = preg_split('/\s+/u', $trimmed) ?: [];
	$letters = '';
	foreach ($parts as $part) {
		if ($part === '') {
			continue;
		}
		$letters .= function_exists('mb_substr')
			? mb_substr($part, 0, 1, 'UTF-8')
			: substr($part, 0, 1);
		$lettersLength = function_exists('mb_strlen')
			? mb_strlen($letters, 'UTF-8')
			: strlen($letters);
		if ($lettersLength >= 2) {
			break;
		}
	}

	if ($letters === '') {
		$letters = function_exists('mb_substr')
			? mb_substr($trimmed, 0, 1, 'UTF-8')
			: substr($trimmed, 0, 1);
	}

	return function_exists('mb_strtoupper')
		? mb_strtoupper($letters, 'UTF-8')
		: strtoupper($letters);
}

function avatarSvgFallback(string $username, int $size = 128): string
{
	$safeSize = max(32, min(512, $size));
	$initials = htmlspecialchars(avatarComputeInitials($username), ENT_QUOTES, 'UTF-8');

	return '<svg xmlns="http://www.w3.org/2000/svg" width="' . $safeSize . '" height="' . $safeSize . '" viewBox="0 0 ' . $safeSize . ' ' . $safeSize . '">' 
		. '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#6a11cb"/><stop offset="100%" stop-color="#2575fc"/></linearGradient></defs>'
		. '<rect width="' . $safeSize . '" height="' . $safeSize . '" rx="' . floor($safeSize / 2) . '" fill="url(#g)"/>'
		. '<text x="50%" y="50%" text-anchor="middle" dominant-baseline="central" fill="#ffffff" font-family="Segoe UI,Arial,sans-serif" font-size="' . floor($safeSize * 0.36) . '" font-weight="700">'
		. $initials
		. '</text></svg>';
}

$userId = isset($_GET['user_id']) ? (int) $_GET['user_id'] : 0;
$username = trim((string) ($_GET['username'] ?? ''));
$size = isset($_GET['size']) ? (int) $_GET['size'] : 128;

if ($userId <= 0 && $username === '') {
	apiError('INVALID_USER_REFERENCE', 'Missing avatar user reference', 400);
}

$userRow = null;
if ($userId > 0) {
	$stmt = $pdo->prepare('SELECT id, username, avatar_path, avatar_mime FROM users WHERE id = ? LIMIT 1');
	$stmt->execute([$userId]);
	$userRow = $stmt->fetch(PDO::FETCH_ASSOC);
} else {
	$normalizedUsername = trim($username);
	if ($normalizedUsername === '') {
		apiError('INVALID_USERNAME', 'Invalid username', 400);
	}
	$stmt = $pdo->prepare('SELECT id, username, avatar_path, avatar_mime FROM users WHERE username = ? LIMIT 1');
	$stmt->execute([$normalizedUsername]);
	$userRow = $stmt->fetch(PDO::FETCH_ASSOC);
}

if (!$userRow) {
	apiError('TARGET_NOT_FOUND', 'Target user not found', 404);
}

$avatarPath = trim((string) ($userRow['avatar_path'] ?? ''));
if ($avatarPath !== '') {
	$absolutePath = realpath(__DIR__ . '/../../' . ltrim($avatarPath, '/'));
	$avatarsRoot = realpath(__DIR__ . '/../../uploads/avatars');

	if ($absolutePath && $avatarsRoot && strpos($absolutePath, $avatarsRoot) === 0 && is_file($absolutePath)) {
		$mime = trim((string) ($userRow['avatar_mime'] ?? ''));
		if ($mime === '') {
			$mime = apiDetectMimeType($absolutePath);
		}

		header('X-Content-Type-Options: nosniff');
		header('Content-Type: ' . $mime);
		header('Content-Length: ' . filesize($absolutePath));
		header('Cache-Control: private, max-age=300');
		readfile($absolutePath);
		exit;
	}
}

$fallbackSvg = avatarSvgFallback((string) ($userRow['username'] ?? 'User'), $size);
header('X-Content-Type-Options: nosniff');
header('Content-Type: image/svg+xml; charset=utf-8');
header('Cache-Control: private, max-age=300');
echo $fallbackSvg;
exit;
