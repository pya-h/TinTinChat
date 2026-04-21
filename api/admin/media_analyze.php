<?php
session_start();

require_once __DIR__ . '/../../includes/db.php';
require_once __DIR__ . '/../../includes/api_helpers.php';

apiRequireMethod('GET');
$userId = apiRequireAuth();
session_write_close();

apiRequireSuperuserAdmin($pdo, $userId);

$olderThanDays = isset($_GET['older_than_days']) ? (int) $_GET['older_than_days'] : 0;
$maxSizeBytes = isset($_GET['max_size_bytes']) ? (int) $_GET['max_size_bytes'] : 0;
$includeSavedMessages = isset($_GET['include_saved_messages'])
    && in_array(strtolower((string) $_GET['include_saved_messages']), ['1', 'true', 'yes', 'on'], true);
$includePlaylists = isset($_GET['include_playlists'])
    && in_array(strtolower((string) $_GET['include_playlists']), ['1', 'true', 'yes', 'on'], true);

if ($olderThanDays < 1) {
    apiError('INVALID_PARAMS', 'older_than_days must be at least 1', 400);
}
if ($maxSizeBytes < 1) {
    apiError('INVALID_PARAMS', 'max_size_bytes must be at least 1', 400);
}

$cutoffDate = date('Y-m-d H:i:s', strtotime("-{$olderThanDays} days"));

$mediaTypes = ['image', 'voice', 'file', 'video'];
$placeholders = implode(',', array_fill(0, count($mediaTypes), '?'));

$sql = "SELECT m.id, m.message_type, m.image_file_path, m.voice_file_path, m.any_file_path,
               m.file_size, m.file_purged_at, m.created_at, m.sender_id, u.username AS sender_username
        FROM messages m
        LEFT JOIN users u ON u.id = m.sender_id
        WHERE m.message_type IN ({$placeholders})
          AND m.created_at < ?
          AND CAST(m.file_size AS UNSIGNED) > " . (int) $maxSizeBytes;

$params = array_merge($mediaTypes, [$cutoffDate]);

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

$baseDir = realpath(__DIR__ . '/../../');

$totalFiles = 0;
$totalSize = 0;
$alreadyPurged = 0;
$missingFromDisk = 0;
$byType = [];
$largestFile = null;
$byUser = [];
$excludedBySaved = 0;
$excludedByPlaylist = 0;
$exclusionCache = [];

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

foreach ($mediaTypes as $type) {
    $byType[$type] = ['count' => 0, 'size' => 0];
}

foreach ($rows as $row) {
    $type = $row['message_type'];

    if ($row['file_purged_at']) {
        $alreadyPurged++;
        continue;
    }

    $filePath = '';
    switch ($type) {
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

    $uploadsDir = match ($type) {
        'image' => $baseDir ? realpath($baseDir . '/uploads/images') : false,
        'voice' => $baseDir ? realpath($baseDir . '/uploads/voice_messages') : false,
        default => $baseDir ? realpath($baseDir . '/uploads/files') : false,
    };
    $col = match ($type) {
        'image' => 'image_file_path',
        'voice' => 'voice_file_path',
        default => 'any_file_path',
    };
    $fileName = basename((string) $filePath);
    if (!$uploadsDir || $fileName === '' || $fileName === '.' || $fileName === '..') {
        continue;
    }

    if ($isExcludedByRules($fileName, $col, (string) $type)) {
        continue;
    }

    $fullPath = realpath($uploadsDir . DIRECTORY_SEPARATOR . $fileName);
    if ($fullPath && strpos($fullPath, $uploadsDir . DIRECTORY_SEPARATOR) !== 0) {
        continue;
    }
    $pathForIo = $fullPath ?: ($uploadsDir . DIRECTORY_SEPARATOR . $fileName);

    $actualSize = file_exists($pathForIo) ? (int) filesize($pathForIo) : 0;
    if (!file_exists($pathForIo)) {
        $missingFromDisk++;
        continue;
    }

    $totalFiles++;
    $totalSize += $actualSize;

    if (isset($byType[$type])) {
        $byType[$type]['count']++;
        $byType[$type]['size'] += $actualSize;
    }

    $username = $row['sender_username'] ?? 'unknown';
    if (!isset($byUser[$username])) {
        $byUser[$username] = ['count' => 0, 'size' => 0];
    }
    $byUser[$username]['count']++;
    $byUser[$username]['size'] += $actualSize;

    if (!$largestFile || $actualSize > $largestFile['size']) {
        $largestFile = [
            'size' => $actualSize,
            'type' => $type,
            'sender_username' => $username,
            'created_at' => $row['created_at'],
        ];
    }
}

// Sort users by total size descending, keep top 5
uasort($byUser, static function ($a, $b) {
    return $b['size'] <=> $a['size'];
});
$topUsers = array_slice($byUser, 0, 5, true);
$topUsersArr = [];
foreach ($topUsers as $uname => $udata) {
    $topUsersArr[] = [
        'username' => $uname,
        'count' => $udata['count'],
        'size' => $udata['size'],
    ];
}

apiSuccess([
    'total_files' => $totalFiles,
    'total_size' => $totalSize,
    'already_purged' => $alreadyPurged,
    'missing_from_disk' => $missingFromDisk,
    'excluded_saved_count' => $excludedBySaved,
    'excluded_playlist_count' => $excludedByPlaylist,
    'include_saved_messages' => $includeSavedMessages,
    'include_playlists' => $includePlaylists,
    'by_type' => $byType,
    'largest_file' => $largestFile,
    'top_users' => $topUsersArr,
    'cutoff_date' => $cutoffDate,
    'max_size_bytes' => $maxSizeBytes,
]);
