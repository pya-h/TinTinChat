<?php
session_start();

require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/group_helpers.php';
require_once __DIR__ . '/../includes/group_crypto_helpers.php';

apiRequireMethod('POST');
$userId = apiRequireAuth();
apiRequireCsrf();

$body = apiGetJsonBody();

$groupId = groupParseId($body['group_id'] ?? $_POST['group_id'] ?? null);
if ($groupId <= 0) {
    apiError('INVALID_GROUP_ID', 'Invalid group id', 400);
}

groupRequireMembership($pdo, $groupId, $userId);

$pdo->beginTransaction();
try {
    groupEnsureMemberHasSharedKey($pdo, $groupId, $userId);

    $stmt = $pdo->prepare('SELECT encrypted_group_key, updated_at, 1 AS key_version FROM group_member_keys WHERE group_id = ? AND user_id = ? LIMIT 1');
    $stmt->execute([$groupId, $userId]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$row || !isset($row['encrypted_group_key']) || trim((string) $row['encrypted_group_key']) === '') {
        throw new RuntimeException('GROUP_KEY_NOT_FOUND');
    }

    $pdo->commit();

    apiSuccess([
        'group_id' => $groupId,
        'encrypted_group_key' => (string) $row['encrypted_group_key'],
        'key_version' => (int) ($row['key_version'] ?? 1),
        'updated_at' => $row['updated_at'] ?? null,
    ]);
} catch (Throwable $ex) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    if ($ex instanceof RuntimeException && $ex->getMessage() === 'GROUP_KEY_NOT_FOUND') {
        apiError('GROUP_KEY_NOT_FOUND', 'Group encryption key not available', 500);
    }

    apiError('GROUP_KEY_FETCH_FAILED', 'Failed to fetch group encryption key', 500);
}
