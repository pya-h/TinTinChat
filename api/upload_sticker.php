<?php
session_start();

require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/api_helpers.php';

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
    && function_exists('imagescale')
    && function_exists('imagecreatetruecolor')
    && function_exists('imagecopy')
    && function_exists('imagesavealpha')
    && function_exists('imagefill');

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

    $resized = imagescale($sourceImage, $targetWidth, $targetHeight, IMG_BICUBIC_FIXED);
    imagedestroy($sourceImage);
    if (!$resized) {
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

$existingStmt = $pdo->prepare('SELECT id, is_active, width, height, file_mime FROM stickers WHERE file_hash = ? LIMIT 1');
$existingStmt->execute([$fileHash]);
$existing = $existingStmt->fetch(PDO::FETCH_ASSOC);

if ($existing) {
    $existingId = (int) ($existing['id'] ?? 0);
    if ((int) ($existing['is_active'] ?? 0) !== 1) {
        $reactivateStmt = $pdo->prepare('UPDATE stickers SET is_active = 1 WHERE id = ?');
        $reactivateStmt->execute([$existingId]);
    }
    @unlink($tempOutputFile);
    apiSuccess([
        'sticker' => [
            'id' => $existingId,
            'width' => (int) ($existing['width'] ?? TTC_STICKER_CANVAS_SIZE),
            'height' => (int) ($existing['height'] ?? TTC_STICKER_CANVAS_SIZE),
            'mime' => (string) ($existing['file_mime'] ?? $targetMime),
            'url' => 'api/get_sticker.php?id=' . $existingId,
        ],
        'duplicate' => true,
    ]);
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

$uploadDir = __DIR__ . '/../uploads/stickers/';
apiEnsureWritableDirectory($uploadDir, 'stickers directory');

$fileName = uniqid('sticker_', true) . '.' . $extension;
$relativePath = 'uploads/stickers/' . $fileName;
$finalPath = $uploadDir . $fileName;

if (@file_put_contents($finalPath, $finalBytes) === false) {
    @unlink($tempOutputFile);
    apiError('FILE_SAVE_FAILED', 'Unable to persist sticker file.', 500);
}
@unlink($tempOutputFile);

try {
    $insert = $pdo->prepare(
        'INSERT INTO stickers (file_path, file_mime, file_hash, width, height, uploaded_by_user_id, is_active)
         VALUES (?, ?, ?, ?, ?, ?, 1)'
    );
    $ok = $insert->execute([
        $relativePath,
        $targetMime,
        $fileHash,
        $finalWidth,
        $finalHeight,
        $userId,
    ]);

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
            'url' => 'api/get_sticker.php?id=' . $stickerId,
        ],
        'duplicate' => false,
    ]);
} catch (PDOException $e) {
    @unlink($finalPath);
    apiError('DB_SAVE_FAILED', 'Failed to save sticker metadata.', 500);
}
