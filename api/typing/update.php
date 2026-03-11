<?php
session_start();

require_once __DIR__ . '/../../includes/db.php';
require_once __DIR__ . '/../../includes/api_helpers.php';
require_once __DIR__ . '/../../includes/group_helpers.php';

function ensureGroupTypingStatusTable(PDO $pdo): void
{
	static $initialized = false;
	if ($initialized) {
		return;
	}

	$pdo->exec(
		'CREATE TABLE IF NOT EXISTS group_typing_status (
			group_id INT NOT NULL,
			typer_user_id INT NOT NULL,
			is_typing TINYINT(1) NOT NULL DEFAULT 0,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
			PRIMARY KEY (group_id, typer_user_id),
			KEY idx_group_typing_lookup (group_id, updated_at),
			CONSTRAINT fk_group_typing_group
			  FOREIGN KEY (group_id) REFERENCES groups(id)
			  ON DELETE CASCADE,
			CONSTRAINT fk_group_typing_user
			  FOREIGN KEY (typer_user_id) REFERENCES users(id)
			  ON DELETE CASCADE
		)'
	);

	$initialized = true;
}

function ensureChatTypingStatusTable(PDO $pdo): void
{
	static $initialized = false;
	if ($initialized) {
		return;
	}

	$pdo->exec(
		'CREATE TABLE IF NOT EXISTS chat_typing_status (
			typer_user_id INT NOT NULL,
			target_user_id INT NOT NULL,
			is_typing TINYINT(1) NOT NULL DEFAULT 0,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
			PRIMARY KEY (typer_user_id, target_user_id),
			KEY idx_typing_target_updated (target_user_id, updated_at),
			CONSTRAINT fk_typing_typer_user
			  FOREIGN KEY (typer_user_id) REFERENCES users(id)
			  ON DELETE CASCADE,
			CONSTRAINT fk_typing_target_user
			  FOREIGN KEY (target_user_id) REFERENCES users(id)
			  ON DELETE CASCADE
		)'
	);

	$initialized = true;
}

apiRequireMethod('POST');
$userId = apiRequireAuth();
apiRequireCsrf();

$body = apiGetJsonBody();
$targetUsernameRaw = trim((string) ($body['target'] ?? ''));
$groupId = groupParseId($body['group_id'] ?? 0);
$isTypingRaw = $body['is_typing'] ?? false;
$isTyping = (int) filter_var($isTypingRaw, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
if ($isTyping !== 0 && $isTyping !== 1) {
	$isTyping = 0;
}

if ($groupId > 0) {
	groupRequireMembership($pdo, $groupId, $userId);

	$runGroupUpsert = static function () use ($pdo, $groupId, $userId, $isTyping): void {
		$upsert = $pdo->prepare(
			'INSERT INTO group_typing_status (group_id, typer_user_id, is_typing)
			 VALUES (?, ?, ?)
			 ON DUPLICATE KEY UPDATE is_typing = VALUES(is_typing), updated_at = CURRENT_TIMESTAMP'
		);
		$upsert->execute([$groupId, $userId, $isTyping]);
	};

	try {
		$runGroupUpsert();
	} catch (PDOException $exception) {
		$errorCode = (string) ($exception->errorInfo[1] ?? '');
		if ($errorCode === '1146') {
			ensureGroupTypingStatusTable($pdo);
			$runGroupUpsert();
		} elseif (in_array($errorCode, ['1054', '1136'], true)) {
			apiError('TYPING_SCHEMA_OUTDATED', 'Typing status schema is missing or outdated. Run migration 10_add_typing_status.sql.', 500);
		} else {
			apiError('DB_SAVE_FAILED', 'Failed to update typing status.', 500);
		}
	}

	apiSuccess([
		'is_typing' => (bool) $isTyping,
		'scope' => 'group',
		'group_id' => $groupId,
	]);
}

$targetUsername = apiNormalizeUsername($targetUsernameRaw, 'INVALID_TARGET_USERNAME');

$stmt = $pdo->prepare('SELECT id FROM users WHERE username = ? LIMIT 1');
$stmt->execute([$targetUsername]);
$targetUser = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$targetUser) {
	apiError('TARGET_NOT_FOUND', 'Target user not found', 404);
}

$targetUserId = (int) $targetUser['id'];
if ($targetUserId === $userId) {
	apiError('INVALID_TARGET_USERNAME', 'Cannot update typing status for self', 400);
}

try {
	$runChatUpsert = static function () use ($pdo, $userId, $targetUserId, $isTyping): void {
		$upsert = $pdo->prepare(
			'INSERT INTO chat_typing_status (typer_user_id, target_user_id, is_typing)
			 VALUES (?, ?, ?)
			 ON DUPLICATE KEY UPDATE is_typing = VALUES(is_typing), updated_at = CURRENT_TIMESTAMP'
		);
		$upsert->execute([$userId, $targetUserId, $isTyping]);
	};

	$runChatUpsert();
} catch (PDOException $exception) {
	$errorCode = (string) ($exception->errorInfo[1] ?? '');
	if ($errorCode === '1146') {
		try {
			ensureChatTypingStatusTable($pdo);
			$runChatUpsert();
		} catch (PDOException $retryException) {
			$retryCode = (string) ($retryException->errorInfo[1] ?? '');
			if (in_array($retryCode, ['1146', '1054', '1136'], true)) {
				apiError('TYPING_SCHEMA_OUTDATED', 'Typing status schema is missing or outdated. Run migration 10_add_typing_status.sql.', 500);
			}
			apiError('DB_SAVE_FAILED', 'Failed to update typing status.', 500);
		}
	} elseif (in_array($errorCode, ['1054', '1136'], true)) {
		apiError('TYPING_SCHEMA_OUTDATED', 'Typing status schema is missing or outdated. Run migration 10_add_typing_status.sql.', 500);
	}
	apiError('DB_SAVE_FAILED', 'Failed to update typing status.', 500);
}

apiSuccess(['is_typing' => (bool) $isTyping]);
