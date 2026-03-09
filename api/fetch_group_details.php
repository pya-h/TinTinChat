<?php
session_start();

require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/group_helpers.php';

apiRequireMethod('GET');
$userId = apiRequireAuth();
$groupId = groupParseId($_GET['group_id'] ?? null);
if ($groupId <= 0) {
    apiError('INVALID_GROUP_ID', 'Invalid group id', 400);
}

$role = groupRequireMembership($pdo, $groupId, $userId);
$group = groupFetchById($pdo, $groupId);
if (!$group) {
    apiError('GROUP_NOT_FOUND', 'Group not found', 404);
}

$membersStmt = $pdo->prepare(
    'SELECT gm.user_id, u.username, u.avatar_path, gm.role, gm.joined_at
     FROM group_members gm
     JOIN users u ON u.id = gm.user_id
     WHERE gm.group_id = ?
    ORDER BY FIELD(gm.role, \'owner\', \'admin\', \'member\'), u.username ASC'
);
$membersStmt->execute([$groupId]);
$members = $membersStmt->fetchAll(PDO::FETCH_ASSOC);

$canManage = in_array($role, ['owner', 'admin'], true);
$canTransferOwner = $role === 'owner';
$canLeave = true;

apiSuccess([
    'group' => [
        'id' => (int) $group['id'],
        'title' => $group['title'],
        'description' => $group['description'],
        'created_by_user_id' => (int) $group['created_by_user_id'],
        'created_at' => $group['created_at'],
        'updated_at' => $group['updated_at'],
        'join_link' => $canManage ? groupBuildJoinLink((string) $group['join_token']) : null,
    ],
    'members' => $members,
    'role' => $role,
    'can_manage' => $canManage,
    'can_transfer_owner' => $canTransferOwner,
    'can_leave' => $canLeave,
]);
