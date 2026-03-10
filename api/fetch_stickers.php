<?php
session_start();

require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/api_helpers.php';

apiRequireMethod('GET');
apiRequireAuth();

$limit = isset($_GET['limit']) ? (int) $_GET['limit'] : 150;
$limit = max(1, min(300, $limit));

$stmt = $pdo->prepare(
    'SELECT s.id, s.width, s.height, s.file_mime, s.created_at, u.username AS uploaded_by_username
     FROM stickers s
     INNER JOIN users u ON u.id = s.uploaded_by_user_id
     WHERE s.is_active = 1
     ORDER BY s.created_at DESC
     LIMIT ?'
);
$stmt->bindValue(1, $limit, PDO::PARAM_INT);
$stmt->execute();
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

$stickers = array_map(static function ($row) {
    $id = isset($row['id']) ? (int) $row['id'] : 0;
    return [
        'id' => $id,
        'width' => isset($row['width']) ? (int) $row['width'] : TTC_STICKER_CANVAS_SIZE,
        'height' => isset($row['height']) ? (int) $row['height'] : TTC_STICKER_CANVAS_SIZE,
        'mime' => isset($row['file_mime']) ? (string) $row['file_mime'] : 'image/webp',
        'created_at' => isset($row['created_at']) ? (string) $row['created_at'] : null,
        'uploaded_by_username' => isset($row['uploaded_by_username']) ? (string) $row['uploaded_by_username'] : '',
        'url' => 'api/get_sticker.php?id=' . $id,
    ];
}, $rows ?: []);

apiSuccess([
    'stickers' => $stickers,
    'count' => count($stickers),
]);
