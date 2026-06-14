<?php
session_start();

require_once __DIR__ . '/../../../tintin-core/includes/db.php';
require_once __DIR__ . '/../../../tintin-core/includes/api_helpers.php';

apiRequireMethod('POST');
$userId = apiRequireAuth();
apiRequireCsrf();
session_write_close();

apiRequireSuperuserAdmin($pdo, $userId);

$body = apiGetJsonBody();

$olderThanDays = isset($body['older_than_days']) ? (int) $body['older_than_days'] : 0;
$maxSizeBytes = isset($body['max_size_bytes']) ? (int) $body['max_size_bytes'] : 0;
$includeSavedMessages = !empty($body['include_saved_messages']);
$includePlaylists = !empty($body['include_playlists']);

if ($olderThanDays < 1) {
    apiError('INVALID_PARAMS', 'older_than_days must be at least 1', 400);
}
if ($maxSizeBytes < 1) {
    apiError('INVALID_PARAMS', 'max_size_bytes must be at least 1', 400);
}

$cutoffDate = date('Y-m-d H:i:s', strtotime("-{$olderThanDays} days"));

$mediaTypes = ['image', 'voice', 'file', 'video'];
$placeholders = implode(',', array_fill(0, count($mediaTypes), '?'));

    $sql = "SELECT id, message_type, image_file_path, voice_file_path, any_file_path, file_size, file_purged_at
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
$baseDir = realpath(__DIR__ . '/../../../tintin-core');
$excludedBySaved = 0;
$excludedByPlaylist = 0;
$exclusionCache = [];
$processedFiles = []; // deduplicate physical files across message rows

$isExcludedByRules = static function (string $fileName, string $col, string $messageType) use (
    $pdo,
    $includeSavedMessages,
    $includePlaylists,
    &$exclusionCache,
    &$excludedBySaved,
    &$excludedByPlaylist
): bool {
    $cacheKey = $col . ':' . $fileName;
    if (isset($exclusionCache[$cacheKey])) {
        return $exclusionCache[$cacheKey];
    }

    $excluded = false;

    if (!$includeSavedMessages) {
        $savedStmt = $pdo->prepare("SELECT 1 FROM messages WHERE group_id IS NULL AND sender_id = receiver_id AND `$col` = ? LIMIT 1");
        $savedStmt->execute([$fileName]);
        if ((bool) $savedStmt->fetchColumn()) {
            $excluded = true;
            $excludedBySaved++;
        }
    }

    if (!$excluded && !$includePlaylists && $messageType === 'file') {
        $playlistStmt = $pdo->prepare(
            "SELECT 1
             FROM messages pm
             INNER JOIN playlist_tracks pt ON pt.message_id = pm.id
             WHERE pm.message_type = 'file' AND pm.any_file_path = ?
             LIMIT 1"
        );
        $playlistStmt->execute([$fileName]);
        if ((bool) $playlistStmt->fetchColumn()) {
            $excluded = true;
            $excludedByPlaylist++;
        }
    }

    $exclusionCache[$cacheKey] = $excluded;
    return $excluded;
};

foreach ($rows as $row) {
    // Skip already-purged rows (same guard as media_analyze.php)
    if (!empty($row['file_purged_at'])) {
        continue;
    }

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

    $uploadsDir = match ($row['message_type']) {
        'image' => realpath($baseDir . '/uploads/images'),
        'voice' => realpath($baseDir . '/uploads/voice_messages'),
        default => realpath($baseDir . '/uploads/files'),
    };
    $fileName = basename((string) $filePath);
    if (!$uploadsDir || $fileName === '' || $fileName === '.' || $fileName === '..') {
        continue;
    }
    $fullPath = realpath($uploadsDir . DIRECTORY_SEPARATOR . $fileName);
    if ($fullPath && strpos($fullPath, $uploadsDir . DIRECTORY_SEPARATOR) !== 0) {
        continue;
    }
    $pathForIo = $fullPath ?: ($uploadsDir . DIRECTORY_SEPARATOR . $fileName);

    $col = match ($row['message_type']) {
        'image' => 'image_file_path',
        'voice' => 'voice_file_path',
        default => 'any_file_path',
    };

    if ($isExcludedByRules($fileName, $col, (string) $row['message_type'])) {
        continue;
    }

    // Deduplicate: same physical file may appear in multiple rows (forwarded messages).
    // The UPDATE below already marks all rows purged; skip counting subsequent appearances.
    $fileKey = $col . ':' . $fileName;
    if (isset($processedFiles[$fileKey])) {
        continue;
    }
    $processedFiles[$fileKey] = true;

    $fileSize = file_exists($pathForIo) ? (int) filesize($pathForIo) : 0;
    $fileDeleted = false;

    if (file_exists($pathForIo)) {
        $fileDeleted = @unlink($pathForIo);
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
    'excluded_saved_count' => $excludedBySaved,
    'excluded_playlist_count' => $excludedByPlaylist,
    'include_saved_messages' => $includeSavedMessages,
    'include_playlists' => $includePlaylists,
    'cutoff_date' => $cutoffDate,
    'max_size_bytes' => $maxSizeBytes,
]);
