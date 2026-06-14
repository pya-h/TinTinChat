<?php
session_start();

require_once __DIR__ . '/../../../../tintin-core/includes/db.php';
require_once __DIR__ . '/../../../../tintin-core/includes/api_helpers.php';

apiRequireMethod('GET');
$userId = apiRequireAuth();
session_write_close();
$isAdmin = apiIsAdminUser($pdo, $userId);

$limit = isset($_GET['limit']) ? (int) $_GET['limit'] : 150;
$limit = max(1, min(300, $limit));

$columns = apiGetTableColumns($pdo, 'stickers');
if (empty($columns) || !isset($columns['id'])) {
	apiError('STICKER_SCHEMA_OUTDATED', 'Stickers schema is missing or outdated. Run migration 14_add_sticker_support.sql.', 500);
}

$selectParts = ['s.id'];
$selectParts[] = isset($columns['width']) ? 's.width' : (TTC_STICKER_CANVAS_SIZE . ' AS width');
$selectParts[] = isset($columns['height']) ? 's.height' : (TTC_STICKER_CANVAS_SIZE . ' AS height');
$selectParts[] = isset($columns['file_mime']) ? 's.file_mime' : "'image/png' AS file_mime";
$selectParts[] = isset($columns['created_at']) ? 's.created_at' : 'NULL AS created_at';
$selectParts[] = isset($columns['is_admin_only']) ? 's.is_admin_only' : '0 AS is_admin_only';

$needsUserJoin = isset($columns['uploaded_by_user_id']);
if ($needsUserJoin) {
	$selectParts[] = 'u.username AS uploaded_by_username';
} else {
	$selectParts[] = "'' AS uploaded_by_username";
}

$fromClause = ' FROM stickers s';
if ($needsUserJoin) {
	$fromClause .= ' INNER JOIN users u ON u.id = s.uploaded_by_user_id';
}

$whereParts = [];
if (isset($columns['is_active'])) {
	$whereParts[] = 's.is_active = 1';
}
if (!$isAdmin && isset($columns['is_admin_only'])) {
	if (isset($columns['uploaded_by_user_id'])) {
		$whereParts[] = '(s.is_admin_only = 0 OR s.uploaded_by_user_id = :viewer_user_id)';
	} else {
		$whereParts[] = 's.is_admin_only = 0';
	}
}

$whereClause = '';
if (!empty($whereParts)) {
	$whereClause = ' WHERE ' . implode(' AND ', $whereParts);
}
$orderByClause = isset($columns['created_at']) ? ' ORDER BY s.created_at DESC' : ' ORDER BY s.id DESC';

$stmt = $pdo->prepare('SELECT ' . implode(', ', $selectParts) . $fromClause . $whereClause . $orderByClause . ' LIMIT :limit');
if (!$isAdmin && isset($columns['is_admin_only']) && isset($columns['uploaded_by_user_id'])) {
	$stmt->bindValue(':viewer_user_id', $userId, PDO::PARAM_INT);
}
$stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
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
		'is_admin_only' => !empty($row['is_admin_only']),
		'url' => 'api/messages/stickers/get.php?id=' . $id,
	];
}, $rows ?: []);

apiSuccess([
	'stickers' => $stickers,
	'count' => count($stickers),
]);
