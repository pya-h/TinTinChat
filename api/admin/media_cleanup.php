<?php
session_start();

require_once __DIR__ . '/../../includes/db.php';
require_once __DIR__ . '/../../includes/api_helpers.php';

apiRequireMethod('POST');
$userId = apiRequireAuth();
apiRequireCsrf();
session_write_close();

apiRequireSuperuserAdmin($pdo, $userId);

$body = apiGetJsonBody();

$olderThanDays = isset($body['older_than_days']) ? (int) $body['older_than_days'] : 0;
$maxSizeBytes = isset($body['max_size_bytes']) ? (int) $body['max_size_bytes'] : 0;

if ($olderThanDays < 1) {
    apiError('INVALID_PARAMS', 'older_than_days must be at least 1', 400);
}
if ($maxSizeBytes < 1) {
    apiError('INVALID_PARAMS', 'max_size_bytes must be at least 1', 400);
}

$cutoffDate = date('Y-m-d H:i:s', strtotime("-{$olderThanDays} days"));

$mediaTypes = ['image', 'voice', 'file', 'video'];
$placeholders = implode(',', array_fill(0, count($mediaTypes), '?'));

$sql = "SELECT id, message_type, image_file_path, voice_file_path, any_file_path, file_size
        FROM messages
        WHERE message_type IN ({$placeholders})
          AND created_at < ?
          AND CAST(file_size AS UNSIGNED) > " . (int) $maxSizeBytes;

$params = array_merge($mediaTypes, [$cutoffDate]);

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

$deletedCount = 0;
$freedBytes = 0;
$failedCount = 0;
$baseDir = realpath(__DIR__ . '/../../');

foreach ($rows as $row) {
    $filePath = '';
    switch ($row['message_type']) {
        case 'image':
            $filePath = $row['image_file_path'] ?? '';
            break;
        case 'voice':
            $filePath = $row['voice_file_path'] ?? '';
            break;
        case 'file':
        case 'video':
            $filePath = $row['any_file_path'] ?? '';
            break;
    }

    if ($filePath === '') {
        continue;
    }

    $fullPath = realpath($baseDir . '/' . $filePath);
    $uploadsBase = realpath($baseDir . '/uploads');
    if (!$fullPath || !$uploadsBase || strpos($fullPath, $uploadsBase . DIRECTORY_SEPARATOR) !== 0) {
        continue;
    }

    $col = match ($row['message_type']) {
        'image' => 'image_file_path',
        'voice' => 'voice_file_path',
        default => 'any_file_path',
    };
    $fileName = basename($filePath);

    $fileSize = file_exists($fullPath) ? (int) filesize($fullPath) : 0;
    $fileDeleted = false;

    if (file_exists($fullPath)) {
        $fileDeleted = @unlink($fullPath);
    } else {
        $fileDeleted = true; // already gone, still mark rows purged
    }

    if ($fileDeleted) {
        $deletedCount++;
        $freedBytes += $fileSize;

        // Mark ALL message rows that share this filename as purged.
        // This covers forwarded copies created by forward_media.php that reuse
        // the same physical file.  Clients will show the admin-purge notice on
        // every copy, not just the original.
        $purgeStmt = $pdo->prepare("UPDATE messages SET file_purged_at = NOW() WHERE `$col` = ?");
        $purgeStmt->execute([$fileName]);
    } else {
        $failedCount++;
    }
}

apiSuccess([
    'deleted_count' => $deletedCount,
    'freed_bytes' => $freedBytes,
    'failed_count' => $failedCount,
    'cutoff_date' => $cutoffDate,
    'max_size_bytes' => $maxSizeBytes,
]);
