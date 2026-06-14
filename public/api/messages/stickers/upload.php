<?php
session_start();

require_once __DIR__ . '/../../../../tintin-core/includes/db.php';
require_once __DIR__ . '/../../../../tintin-core/includes/api_helpers.php';

apiRequireMethod('POST');
$userId = apiRequireAuth();
apiRequireCsrf();
apiGuardOversizedPostBody();

$stickerFile = apiRequireUploadedFile('sticker_file');

if ((int) $stickerFile['size'] > TTC_UPLOAD_IMAGE_MAX_BYTES) {
	apiError('FILE_TOO_LARGE', 'Sticker source image is too large. Max 20MB allowed.', 400);
}

$tmpPath = (string) ($stickerFile['tmp_name'] ?? '');
if ($tmpPath === '' || !is_uploaded_file($tmpPath)) {
	apiError('UPLOAD_FAILED', 'Invalid sticker upload payload.', 400);
}

$detectedMime = apiDetectMimeType($tmpPath);
if (strpos($detectedMime, 'image/') !== 0) {
	apiError('INVALID_STICKER_TYPE', 'Sticker file must be a valid image.', 400);
}

$raw = @file_get_contents($tmpPath);
if ($raw === false || $raw === '') {
	apiError('INVALID_STICKER_FILE', 'Unable to read uploaded sticker.', 400);
}

$finalBytes = '';
$targetMime = '';
$finalWidth = TTC_STICKER_CANVAS_SIZE;
$finalHeight = TTC_STICKER_CANVAS_SIZE;

$hasGdProcessing = function_exists('imagecreatefromstring')
	&& function_exists('imagecreatetruecolor')
	&& function_exists('imagecopy')
	&& function_exists('imagecopyresampled')
	&& function_exists('imagesavealpha')
	&& function_exists('imagefill')
	&& function_exists('imagedestroy');

if ($hasGdProcessing) {
	$sourceImage = @imagecreatefromstring($raw);
	if (!$sourceImage) {
		apiError('INVALID_STICKER_FILE', 'Invalid sticker image.', 400);
	}

	$srcWidth = imagesx($sourceImage);
	$srcHeight = imagesy($sourceImage);
	if ($srcWidth <= 0 || $srcHeight <= 0) {
		imagedestroy($sourceImage);
		apiError('INVALID_STICKER_DIMENSIONS', 'Sticker dimensions are invalid.', 400);
	}

	$canvasSize = TTC_STICKER_CANVAS_SIZE;
	$scale = min($canvasSize / $srcWidth, $canvasSize / $srcHeight);
	$targetWidth = max(1, (int) round($srcWidth * $scale));
	$targetHeight = max(1, (int) round($srcHeight * $scale));

	$resized = imagecreatetruecolor($targetWidth, $targetHeight);
	if (!$resized) {
		imagedestroy($sourceImage);
		apiError('STICKER_RESIZE_FAILED', 'Unable to resize sticker.', 500);
	}

	imagesavealpha($resized, true);
	$resizeTransparent = imagecolorallocatealpha($resized, 0, 0, 0, 127);
	imagefill($resized, 0, 0, $resizeTransparent);

	$resizeOk = imagecopyresampled(
		$resized,
		$sourceImage,
		0,
		0,
		0,
		0,
		$targetWidth,
		$targetHeight,
		$srcWidth,
		$srcHeight
	);
	imagedestroy($sourceImage);
	if (!$resizeOk) {
		imagedestroy($resized);
		apiError('STICKER_RESIZE_FAILED', 'Unable to resize sticker.', 500);
	}

	$canvas = imagecreatetruecolor($canvasSize, $canvasSize);
	if (!$canvas) {
		imagedestroy($resized);
		apiError('STICKER_CANVAS_FAILED', 'Unable to prepare sticker canvas.', 500);
	}

	imagesavealpha($canvas, true);
	$transparent = imagecolorallocatealpha($canvas, 0, 0, 0, 127);
	imagefill($canvas, 0, 0, $transparent);

	$offsetX = (int) floor(($canvasSize - $targetWidth) / 2);
	$offsetY = (int) floor(($canvasSize - $targetHeight) / 2);
	imagecopy($canvas, $resized, $offsetX, $offsetY, 0, 0, $targetWidth, $targetHeight);
	imagedestroy($resized);

	$supportsWebp = function_exists('imagewebp');
	$targetMime = $supportsWebp ? 'image/webp' : 'image/png';

	$tempOutputFile = tempnam(sys_get_temp_dir(), 'ttc_sticker_');
	if ($tempOutputFile === false) {
		imagedestroy($canvas);
		apiError('STICKER_SAVE_FAILED', 'Unable to prepare sticker output.', 500);
	}

	$saved = false;
	if ($supportsWebp) {
		$saved = @imagewebp($canvas, $tempOutputFile, 82);
	} else {
		$saved = @imagepng($canvas, $tempOutputFile, 9);
	}
	imagedestroy($canvas);

	if (!$saved || !is_file($tempOutputFile)) {
		@unlink($tempOutputFile);
		apiError('STICKER_SAVE_FAILED', 'Unable to save processed sticker.', 500);
	}

	$finalBytes = (string) @file_get_contents($tempOutputFile);
	@unlink($tempOutputFile);
	if ($finalBytes === '') {
		apiError('STICKER_SAVE_FAILED', 'Unable to finalize sticker bytes.', 500);
	}
	$finalWidth = $canvasSize;
	$finalHeight = $canvasSize;
} else {
	$imageInfo = @getimagesize($tmpPath);
	if (!$imageInfo || !isset($imageInfo[0], $imageInfo[1])) {
		apiError('INVALID_STICKER_FILE', 'Invalid sticker image.', 400);
	}

	$width = (int) $imageInfo[0];
	$height = (int) $imageInfo[1];
	if ($width <= 0 || $height <= 0) {
		apiError('INVALID_STICKER_DIMENSIONS', 'Sticker dimensions are invalid.', 400);
	}
	if ($width > TTC_STICKER_CANVAS_SIZE || $height > TTC_STICKER_CANVAS_SIZE) {
		apiError(
			'STICKER_PROCESSING_UNAVAILABLE',
			'Server image processing is unavailable. Please choose an image up to 512x512.',
			400
		);
	}

	$targetMime = strtolower((string) ($imageInfo['mime'] ?? $detectedMime));
	if (strpos($targetMime, 'image/') !== 0) {
		$targetMime = $detectedMime;
	}

	$finalBytes = $raw;
	$finalWidth = $width;
	$finalHeight = $height;
}

$finalSize = strlen($finalBytes);
if ($finalSize <= 0 || $finalSize > TTC_UPLOAD_STICKER_MAX_BYTES) {
	apiError('STICKER_OUTPUT_TOO_LARGE', 'Processed sticker exceeds 512KB. Try a simpler image.', 400);
}

$fileHash = hash('sha256', $finalBytes);

$stickerColumns = apiGetTableColumns($pdo, 'stickers');
if (empty($stickerColumns) || !isset($stickerColumns['file_path'])) {
	apiError('STICKER_SCHEMA_OUTDATED', 'Stickers schema is missing required columns. Run migration 14_add_sticker_support.sql.', 500);
}

if (isset($stickerColumns['file_hash'])) {
	$selectParts = ['id'];
	$selectParts[] = isset($stickerColumns['is_active']) ? 'is_active' : '1 AS is_active';
	$selectParts[] = isset($stickerColumns['width']) ? 'width' : (TTC_STICKER_CANVAS_SIZE . ' AS width');
	$selectParts[] = isset($stickerColumns['height']) ? 'height' : (TTC_STICKER_CANVAS_SIZE . ' AS height');
	$selectParts[] = isset($stickerColumns['file_mime']) ? 'file_mime' : ($pdo->quote($targetMime) . ' AS file_mime');

	$existingStmt = $pdo->prepare('SELECT ' . implode(', ', $selectParts) . ' FROM stickers WHERE file_hash = ? LIMIT 1');
	$existingStmt->execute([$fileHash]);
	$existing = $existingStmt->fetch(PDO::FETCH_ASSOC);

	if ($existing) {
		$existingId = (int) ($existing['id'] ?? 0);
		if (isset($stickerColumns['is_active']) && (int) ($existing['is_active'] ?? 0) !== 1) {
			$reactivateStmt = $pdo->prepare('UPDATE stickers SET is_active = 1 WHERE id = ?');
			$reactivateStmt->execute([$existingId]);
		}
		apiSuccess([
			'sticker' => [
				'id' => $existingId,
				'width' => (int) ($existing['width'] ?? TTC_STICKER_CANVAS_SIZE),
				'height' => (int) ($existing['height'] ?? TTC_STICKER_CANVAS_SIZE),
				'mime' => (string) ($existing['file_mime'] ?? $targetMime),
				'url' => 'api/messages/stickers/get.php?id=' . $existingId,
			],
			'duplicate' => true,
		]);
	}
}

$extensionByMime = [
	'image/webp' => 'webp',
	'image/png' => 'png',
	'image/jpeg' => 'jpg',
	'image/jpg' => 'jpg',
	'image/gif' => 'gif',
	'image/bmp' => 'bmp',
	'image/x-ms-bmp' => 'bmp',
];
$extension = isset($extensionByMime[$targetMime]) ? $extensionByMime[$targetMime] : 'img';

$uploadDir = __DIR__ . '/../../../../tintin-core/uploads/stickers/';

$fileName = uniqid('sticker_', true) . '.' . $extension;
$relativePath = 'uploads/stickers/' . $fileName;
$finalPath = $uploadDir . $fileName;

if (@file_put_contents($finalPath, $finalBytes) === false) {
	apiEnsureWritableDirectory($uploadDir, 'stickers directory');
	if (@file_put_contents($finalPath, $finalBytes) === false) {
		apiError('FILE_SAVE_FAILED', 'Unable to persist sticker file.', 500);
	}
}

try {
	$insertColumns = ['file_path'];
	$insertValues = [$relativePath];
	$placeholders = ['?'];

	if (isset($stickerColumns['file_mime'])) {
		$insertColumns[] = 'file_mime';
		$insertValues[] = $targetMime;
		$placeholders[] = '?';
	}
	if (isset($stickerColumns['file_hash'])) {
		$insertColumns[] = 'file_hash';
		$insertValues[] = $fileHash;
		$placeholders[] = '?';
	}
	if (isset($stickerColumns['width'])) {
		$insertColumns[] = 'width';
		$insertValues[] = $finalWidth;
		$placeholders[] = '?';
	}
	if (isset($stickerColumns['height'])) {
		$insertColumns[] = 'height';
		$insertValues[] = $finalHeight;
		$placeholders[] = '?';
	}
	if (isset($stickerColumns['uploaded_by_user_id'])) {
		$insertColumns[] = 'uploaded_by_user_id';
		$insertValues[] = $userId;
		$placeholders[] = '?';
	}
	if (isset($stickerColumns['is_active'])) {
		$insertColumns[] = 'is_active';
		$insertValues[] = 1;
		$placeholders[] = '?';
	}

	$insert = $pdo->prepare(
		'INSERT INTO stickers (' . implode(', ', $insertColumns) . ') VALUES (' . implode(', ', $placeholders) . ')'
	);
	$ok = $insert->execute($insertValues);

	if (!$ok) {
		@unlink($finalPath);
		apiError('DB_SAVE_FAILED', 'Failed to save sticker metadata.', 500);
	}

	$stickerId = (int) $pdo->lastInsertId();
	apiSuccess([
		'sticker' => [
			'id' => $stickerId,
			'width' => $finalWidth,
			'height' => $finalHeight,
			'mime' => $targetMime,
			'url' => 'api/messages/stickers/get.php?id=' . $stickerId,
		],
		'duplicate' => false,
	]);
} catch (PDOException $e) {
	@unlink($finalPath);
	$errorCode = (string) ($e->errorInfo[1] ?? '');
	if (in_array($errorCode, ['1054', '1136', '1146', '1364', '1048'], true)) {
		apiError('STICKER_SCHEMA_OUTDATED', 'Stickers schema is outdated. Run migration 14_add_sticker_support.sql.', 500);
	}
	if ($errorCode === '1452') {
		apiError('STICKER_OWNER_INVALID', 'Sticker owner reference failed. Ensure current session user exists in users table.', 500);
	}
	if ($errorCode === '1142') {
		apiError('DB_PERMISSION_DENIED', 'Database user lacks write permission for stickers table.', 500);
	}
	apiError('DB_SAVE_FAILED', 'Failed to save sticker metadata.', 500);
}
