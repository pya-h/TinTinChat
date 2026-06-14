<?php
session_start();

require_once __DIR__ . '/../../../../tintin-core/includes/db.php';
require_once __DIR__ . '/../../../../tintin-core/includes/api_helpers.php';

apiRequireMethod('GET');
$userId = apiRequireAuth();
apiRequireAdminUser($pdo, $userId);

$limit = isset($_GET['limit']) ? (int) $_GET['limit'] : 250;
$limit = max(1, min(500, $limit));

$columns = apiGetTableColumns($pdo, 'stickers');
if (empty($columns) || !isset($columns['id']) || !isset($columns['is_admin_only'])) {
    apiError('STICKER_SCHEMA_OUTDATED', 'Stickers schema is missing or outdated. Run migration 18_add_sticker_admin_only_support.sql.', 500);
}

$selectParts = [
    's.id',
    's.is_admin_only',
    isset($columns['is_active']) ? 's.is_active' : '1 AS is_active',
    isset($columns['created_at']) ? 's.created_at' : 'NULL AS created_at',
    isset($columns['uploaded_by_user_id']) ? 's.uploaded_by_user_id' : '0 AS uploaded_by_user_id',
    isset($columns['file_mime']) ? 's.file_mime' : "'image/png' AS file_mime",
    isset($columns['width']) ? 's.width' : (TTC_STICKER_CANVAS_SIZE . ' AS width'),
    isset($columns['height']) ? 's.height' : (TTC_STICKER_CANVAS_SIZE . ' AS height'),
    isset($columns['uploaded_by_user_id']) ? 'u.username AS uploaded_by_username' : "'' AS uploaded_by_username",
];

$fromClause = ' FROM stickers s';
if (isset($columns['uploaded_by_user_id'])) {
    $fromClause .= ' LEFT JOIN users u ON u.id = s.uploaded_by_user_id';
}

$orderByClause = isset($columns['created_at']) ? ' ORDER BY s.created_at DESC' : ' ORDER BY s.id DESC';
$stmt = $pdo->prepare('SELECT ' . implode(', ', $selectParts) . $fromClause . $orderByClause . ' LIMIT :limit');
$stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
$stmt->execute();
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

$stickers = array_map(static function ($row) {
    $id = (int) ($row['id'] ?? 0);
    return [
        'id' => $id,
        'is_admin_only' => !empty($row['is_admin_only']),
        'is_active' => !empty($row['is_active']),
        'uploaded_by_user_id' => (int) ($row['uploaded_by_user_id'] ?? 0),
        'uploaded_by_username' => (string) ($row['uploaded_by_username'] ?? ''),
        'created_at' => isset($row['created_at']) ? (string) $row['created_at'] : null,
        'mime' => (string) ($row['file_mime'] ?? 'image/webp'),
        'width' => (int) ($row['width'] ?? TTC_STICKER_CANVAS_SIZE),
        'height' => (int) ($row['height'] ?? TTC_STICKER_CANVAS_SIZE),
        'url' => 'api/messages/stickers/get.php?id=' . $id,
    ];
}, $rows ?: []);

apiSuccess([
    'stickers' => $stickers,
    'count' => count($stickers),
]);
