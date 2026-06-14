<?php
session_start();

require_once __DIR__ . '/../../../tintin-core/includes/db.php';
require_once __DIR__ . '/../../../tintin-core/includes/api_helpers.php';
require_once __DIR__ . '/../../../tintin-core/includes/block_helpers.php';

apiRequireMethod('POST');
$currentUserId = apiRequireAuth();
apiRequireCsrf();

$body = apiGetJsonBody();
$targetUserId = isset($body['target_user_id']) ? (int) $body['target_user_id'] : (int) ($_POST['target_user_id'] ?? 0);
$targetUsername = isset($body['target_username'])
	? trim((string) $body['target_username'])
	: trim((string) ($_POST['target_username'] ?? ''));

$resolvedTargetId = blockFindTargetUserId(
	$pdo,
	$targetUserId > 0 ? $targetUserId : null,
	$targetUsername !== '' ? $targetUsername : null
);

blockValidateTargetUserId($currentUserId, $resolvedTargetId);

$stmt = $pdo->prepare('DELETE FROM user_blocks WHERE blocker_user_id = ? AND blocked_user_id = ? LIMIT 1');
$stmt->execute([$currentUserId, $resolvedTargetId]);

apiSuccess([
	'blocked_user_id' => $resolvedTargetId,
	'is_blocked' => false,
]);
