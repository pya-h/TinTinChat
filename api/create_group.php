<?php
session_start();

require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/group_helpers.php';

apiRequireMethod('POST');
$userId = apiRequireAuth();
apiRequireCsrf();

$body = apiGetJsonBody();
$title = trim((string) ($body['title'] ?? $_POST['title'] ?? ''));
$description = trim((string) ($body['description'] ?? $_POST['description'] ?? ''));

if (groupStringLength($title) < TTC_GROUP_TITLE_MIN_LENGTH || groupStringLength($title) > TTC_GROUP_TITLE_MAX_LENGTH) {
    apiError('INVALID_GROUP_TITLE', 'Group title length is invalid', 400);
}

if (groupStringLength($description) > TTC_GROUP_DESCRIPTION_MAX_LENGTH) {
    apiError('INVALID_GROUP_DESCRIPTION', 'Group description is too long', 400);
}

$joinToken = groupGenerateUniqueJoinToken($pdo);

$pdo->beginTransaction();
try {
    $stmt = $pdo->prepare('INSERT INTO groups (title, description, created_by_user_id, join_token) VALUES (?, ?, ?, ?)');
    $stmt->execute([$title, $description !== '' ? $description : null, $userId, $joinToken]);
    $groupId = (int) $pdo->lastInsertId();

    $memberStmt = $pdo->prepare('INSERT INTO group_members (group_id, user_id, role, invited_by_user_id) VALUES (?, ?, ?, ?)');
    $memberStmt->execute([$groupId, $userId, 'owner', $userId]);

    $pdo->commit();
} catch (Throwable $ex) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    apiError('GROUP_CREATE_FAILED', 'Failed to create group', 500);
}

apiSuccess([
    'group' => [
        'id' => $groupId,
        'title' => $title,
        'description' => $description,
        'join_token' => $joinToken,
        'join_link' => groupBuildJoinLink($joinToken),
        'role' => 'owner',
    ],
], 201);
