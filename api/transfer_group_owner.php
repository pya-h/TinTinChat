<?php
session_start();

require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/group_helpers.php';

apiRequireMethod('POST');
$currentUserId = apiRequireAuth();
apiRequireCsrf();

$body = apiGetJsonBody();
$groupId = groupParseId($body['group_id'] ?? $_POST['group_id'] ?? null);
$newOwnerUserId = groupParseId($body['new_owner_user_id'] ?? $_POST['new_owner_user_id'] ?? null);
if ($groupId <= 0 || $newOwnerUserId <= 0) {
    apiError('INVALID_PARAMETERS', 'Invalid group/new owner parameters', 400);
}

$currentRole = groupRequireMembership($pdo, $groupId, $currentUserId);
if ($currentRole !== 'owner') {
    apiError('GROUP_FORBIDDEN', 'Only owner can transfer ownership', 403);
}

if ($newOwnerUserId === $currentUserId) {
    apiError('INVALID_NEW_OWNER', 'New owner must be different from current owner', 400);
}

$targetStmt = $pdo->prepare('SELECT role FROM group_members WHERE group_id = ? AND user_id = ? LIMIT 1');
$targetStmt->execute([$groupId, $newOwnerUserId]);
$targetRole = $targetStmt->fetchColumn();
if (!$targetRole) {
    apiError('GROUP_MEMBER_NOT_FOUND', 'Target user is not in this group', 404);
}

$pdo->beginTransaction();
try {
    $setCurrentAdminStmt = $pdo->prepare('UPDATE group_members SET role = ? WHERE group_id = ? AND user_id = ? LIMIT 1');
    $setCurrentAdminStmt->execute(['admin', $groupId, $currentUserId]);

    $setNewOwnerStmt = $pdo->prepare('UPDATE group_members SET role = ? WHERE group_id = ? AND user_id = ? LIMIT 1');
    $setNewOwnerStmt->execute(['owner', $groupId, $newOwnerUserId]);

    $updateGroupStmt = $pdo->prepare('UPDATE groups SET created_by_user_id = ?, updated_at = NOW() WHERE id = ? LIMIT 1');
    $updateGroupStmt->execute([$newOwnerUserId, $groupId]);

    $pdo->commit();
} catch (Throwable $ex) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    apiError('OWNER_TRANSFER_FAILED', 'Failed to transfer ownership', 500);
}

apiSuccess([
    'group_id' => $groupId,
    'previous_owner_user_id' => $currentUserId,
    'new_owner_user_id' => $newOwnerUserId,
]);
