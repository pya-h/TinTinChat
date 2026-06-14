<?php
session_start();

require_once __DIR__ . '/../../../../tintin-core/includes/db.php';
require_once __DIR__ . '/../../../../tintin-core/includes/api_helpers.php';

apiRequireMethod('GET');
$userId = apiRequireAuth();
apiRequireSuperuserAdmin($pdo, $userId);

$superuserUsername = apiGetConfiguredSuperuserUsername();

$sql = 'SELECT id, username, is_admin, banned_at, last_login FROM users ORDER BY is_admin DESC, username ASC';

$stmt = $pdo->query($sql);
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];

$users = array_map(static function ($row) use ($superuserUsername, $userId) {
    $username = (string) ($row['username'] ?? '');
    $targetUserId = (int) ($row['id'] ?? 0);
    $isSuperuser = $superuserUsername !== '' && strcasecmp($username, $superuserUsername) === 0;

    return [
        'id' => $targetUserId,
        'username' => $username,
        'is_admin' => !empty($row['is_admin']),
        'banned_at' => isset($row['banned_at']) ? (string) $row['banned_at'] : null,
        'is_superuser' => $isSuperuser,
        'last_login' => isset($row['last_login']) ? (string) $row['last_login'] : null,
        'can_edit' => !$isSuperuser && $targetUserId !== $userId,
    ];
}, $rows);

apiSuccess([
    'superuser_username' => $superuserUsername,
    'users' => $users,
]);
