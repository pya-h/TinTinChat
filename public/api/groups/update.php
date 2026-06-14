<?php
session_start();

require_once __DIR__ . '/../../../tintin-core/includes/db.php';
require_once __DIR__ . '/../../../tintin-core/includes/group_helpers.php';

apiRequireMethod('POST');
$userId = apiRequireAuth();
apiRequireCsrf();

$body = apiGetJsonBody();
$groupId = groupParseId($body['group_id'] ?? $_POST['group_id'] ?? null);
if ($groupId <= 0) {
	apiError('INVALID_GROUP_ID', 'Invalid group id', 400);
}

groupRequireManagePermission($pdo, $groupId, $userId);

$title = trim((string) ($body['title'] ?? $_POST['title'] ?? ''));
$description = trim((string) ($body['description'] ?? $_POST['description'] ?? ''));

if (groupStringLength($title) < TTC_GROUP_TITLE_MIN_LENGTH || groupStringLength($title) > TTC_GROUP_TITLE_MAX_LENGTH) {
	apiError('INVALID_GROUP_TITLE', 'Group title length is invalid', 400);
}
if (groupStringLength($description) > TTC_GROUP_DESCRIPTION_MAX_LENGTH) {
	apiError('INVALID_GROUP_DESCRIPTION', 'Group description is too long', 400);
}

$updateStmt = $pdo->prepare('UPDATE groups SET title = ?, description = ?, updated_at = NOW() WHERE id = ? LIMIT 1');
if (!$updateStmt->execute([$title, $description !== '' ? $description : null, $groupId])) {
	apiError('GROUP_UPDATE_FAILED', 'Failed to update group', 500);
}

apiSuccess([
	'group' => [
		'id' => $groupId,
		'title' => $title,
		'description' => $description,
	],
]);
