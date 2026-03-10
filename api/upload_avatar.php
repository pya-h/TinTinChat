<?php
require_once __DIR__ . '/users/upload_avatar.php';
return;

require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/api_helpers.php';

apiRequireMethod('POST');
$userId = apiRequireAuth();
apiRequireCsrf();
apiGuardOversizedPostBody();

$avatarFile = apiRequireUploadedFile('avatar_file');

if ((int) $avatarFile['size'] > TTC_UPLOAD_AVATAR_MAX_BYTES) {
    apiError('FILE_TOO_LARGE', 'Avatar file is too large. Maximum size is 5MB.', 400);
}

$detectedMime = apiDetectMimeType((string) $avatarFile['tmp_name']);
$allowedMimeToExtension = [
    'image/jpeg' => 'jpg',
    'image/png' => 'png',
    'image/webp' => 'webp',
    'image/gif' => 'gif',
];

if (!isset($allowedMimeToExtension[$detectedMime])) {
    apiError('INVALID_IMAGE_TYPE', 'Invalid avatar image type. Allowed types: JPG, PNG, WEBP, GIF.', 400);
}

$uploadsDir = __DIR__ . '/../uploads';
$avatarsDir = __DIR__ . '/../uploads/avatars';
apiEnsureWritableDirectory($uploadsDir, 'uploads directory');
apiEnsureWritableDirectory($avatarsDir, 'avatars directory');

$extension = $allowedMimeToExtension[$detectedMime];
$newFilename = sprintf('avatar_u%d_%s.%s', $userId, uniqid('', true), $extension);
$targetPath = $avatarsDir . '/' . $newFilename;

$selectStmt = $pdo->prepare('SELECT avatar_path FROM users WHERE id = ? LIMIT 1');
$selectStmt->execute([$userId]);
$oldAvatarPath = (string) ($selectStmt->fetchColumn() ?: '');

if (!move_uploaded_file((string) $avatarFile['tmp_name'], $targetPath)) {
    apiError('FILE_SAVE_FAILED', 'Failed to save avatar file.', 500);
}

try {
    $updateStmt = $pdo->prepare('UPDATE users SET avatar_path = ?, avatar_mime = ?, avatar_updated_at = NOW() WHERE id = ?');
    $updateStmt->execute([
        'uploads/avatars/' . $newFilename,
        $detectedMime,
        $userId,
    ]);
} catch (Throwable $ex) {
    @unlink($targetPath);
    apiError('DB_SAVE_FAILED', 'Failed to save avatar metadata.', 500);
}

if ($oldAvatarPath !== '') {
    $oldFullPath = realpath(__DIR__ . '/../' . ltrim($oldAvatarPath, '/'));
    $avatarsRoot = realpath($avatarsDir);
    if ($oldFullPath && $avatarsRoot && strpos($oldFullPath, $avatarsRoot) === 0 && file_exists($oldFullPath)) {
        @unlink($oldFullPath);
    }
}

apiSuccess([
    'message' => 'Avatar updated successfully',
    'avatar_url' => 'api/users/get_avatar.php?user_id=' . $userId . '&v=' . time(),
]);
