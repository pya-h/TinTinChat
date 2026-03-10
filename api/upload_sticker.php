<?php
session_start();

require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/api_helpers.php';

apiRequireMethod('POST');
$userId = apiRequireAuth();
apiRequireCsrf();
apiGuardOversizedPostBody();

$stickerFile = apiRequireUploadedFile('sticker_file');

if ((int) $stickerFile['size'] > TTC_UPLOAD_STICKER_MAX_BYTES) {
    apiError('FILE_TOO_LARGE', 'Sticker file is too large. Max 512KB allowed.', 400);
}

$tmpPath = (string) ($stickerFile['tmp_name'] ?? '');
if ($tmpPath === '' || !is_uploaded_file($tmpPath)) {
    apiError('UPLOAD_FAILED', 'Invalid sticker upload payload.', 400);
}

$detectedMime = apiDetectMimeType($tmpPath);
$allowedMimes = ['image/webp', 'image/png'];
if (!in_array($detectedMime, $allowedMimes, true)) {
    apiError('INVALID_STICKER_TYPE', 'Sticker must be WEBP or PNG.', 400);
}

if (!function_exists('imagecreatefromstring') || !function_exists('imagescale')) {
    apiError('STICKER_PROCESSING_UNAVAILABLE', 'Sticker processing is unavailable on this server.', 500);
}

$raw = @file_get_contents($tmpPath);
if ($raw === false || $raw === '') {
    apiError('INVALID_STICKER_FILE', 'Unable to read uploaded sticker.', 400);
}

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

$uploadDir = __DIR__ . '/../uploads/stickers/';
apiEnsureWritableDirectory($uploadDir, 'stickers directory');

$supportsWebp = function_exists('imagewebp');
$extension = $supportsWebp ? 'webp' : 'png';
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

$finalSize = (int) @filesize($tempOutputFile);
if ($finalSize <= 0 || $finalSize > TTC_UPLOAD_STICKER_MAX_BYTES) {
    @unlink($tempOutputFile);
    apiError('STICKER_OUTPUT_TOO_LARGE', 'Processed sticker exceeds 512KB. Try a simpler image.', 400);
}

$finalBytes = @file_get_contents($tempOutputFile);
if ($finalBytes === false || $finalBytes === '') {
    @unlink($tempOutputFile);
    apiError('STICKER_SAVE_FAILED', 'Unable to finalize sticker bytes.', 500);
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
        TTC_STICKER_CANVAS_SIZE,
        TTC_STICKER_CANVAS_SIZE,
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
            'width' => TTC_STICKER_CANVAS_SIZE,
            'height' => TTC_STICKER_CANVAS_SIZE,
            'mime' => $targetMime,
            'url' => 'api/get_sticker.php?id=' . $stickerId,
        ],
        'duplicate' => false,
    ]);
} catch (PDOException $e) {
    @unlink($finalPath);
    apiError('DB_SAVE_FAILED', 'Failed to save sticker metadata.', 500);
}
