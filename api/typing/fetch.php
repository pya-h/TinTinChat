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

apiRequireMethod('GET');
$userId = apiRequireAuth();

$groupId = groupParseId($_GET['group_id'] ?? 0);
if ($groupId > 0) {
	groupRequireMembership($pdo, $groupId, $userId);

	$runGroupFetch = static function () use ($pdo, $groupId, $userId): array {
		$stmt = $pdo->prepare(
			'SELECT u.username
			 FROM group_typing_status gts
			 INNER JOIN users u ON u.id = gts.typer_user_id
			 WHERE gts.group_id = ?
			   AND gts.typer_user_id <> ?
			   AND gts.is_typing = 1
			   AND gts.updated_at >= (NOW() - INTERVAL 8 SECOND)
			 ORDER BY gts.updated_at DESC'
		);
		$stmt->execute([$groupId, $userId]);
		return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
	};

	try {
		$rows = $runGroupFetch();
	} catch (PDOException $exception) {
		$errorCode = (string) ($exception->errorInfo[1] ?? '');
		if ($errorCode === '1146') {
			ensureGroupTypingStatusTable($pdo);
			$rows = $runGroupFetch();
		} elseif (in_array($errorCode, ['1054', '1136'], true)) {
			apiError('TYPING_SCHEMA_OUTDATED', 'Typing status schema is missing or outdated. Run migration 10_add_typing_status.sql.', 500);
		} else {
			apiError('DB_FETCH_FAILED', 'Failed to fetch typing status.', 500);
		}
	}

	$typers = [];
	foreach ($rows as $row) {
		$username = trim((string) ($row['username'] ?? ''));
		if ($username !== '') {
			$typers[] = $username;
		}
	}

	apiSuccess([
		'is_typing' => count($typers) > 0,
		'typers' => $typers,
		'scope' => 'group',
		'group_id' => $groupId,
	]);
}

$otherUsername = apiNormalizeUsername($_GET['with'] ?? '', 'INVALID_TARGET_USERNAME');
$stmt = $pdo->prepare('SELECT id FROM users WHERE username = ? LIMIT 1');
$stmt->execute([$otherUsername]);
$otherUser = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$otherUser) {
	apiError('TARGET_NOT_FOUND', 'Target user not found', 404);
}

$otherUserId = (int) $otherUser['id'];
if ($otherUserId === $userId) {
	apiSuccess(['is_typing' => false]);
}

try {
	$runPrivateFetch = static function () use ($pdo, $otherUserId, $userId): array|false {
		$check = $pdo->prepare(
			'SELECT is_typing, updated_at
			 FROM chat_typing_status
			 WHERE typer_user_id = ? AND target_user_id = ?
			 LIMIT 1'
		);
		$check->execute([$otherUserId, $userId]);
		return $check->fetch(PDO::FETCH_ASSOC);
	};

	$row = $runPrivateFetch();
} catch (PDOException $exception) {
	$errorCode = (string) ($exception->errorInfo[1] ?? '');
	if ($errorCode === '1146') {
		try {
			ensureChatTypingStatusTable($pdo);
			$row = $runPrivateFetch();
		} catch (PDOException $retryException) {
			$retryCode = (string) ($retryException->errorInfo[1] ?? '');
			if (in_array($retryCode, ['1146', '1054', '1136'], true)) {
				apiError('TYPING_SCHEMA_OUTDATED', 'Typing status schema is missing or outdated. Run migration 10_add_typing_status.sql.', 500);
			}
			apiError('DB_FETCH_FAILED', 'Failed to fetch typing status.', 500);
		}
	} elseif (in_array($errorCode, ['1054', '1136'], true)) {
		apiError('TYPING_SCHEMA_OUTDATED', 'Typing status schema is missing or outdated. Run migration 10_add_typing_status.sql.', 500);
	}
	apiError('DB_FETCH_FAILED', 'Failed to fetch typing status.', 500);
}

if (!$row) {
	apiSuccess(['is_typing' => false]);
}

$isTyping = (int) ($row['is_typing'] ?? 0) === 1;
$updatedAt = isset($row['updated_at']) ? strtotime((string) $row['updated_at']) : false;
$isFresh = $updatedAt !== false && $updatedAt >= (time() - 8);

apiSuccess([
	'is_typing' => $isTyping && $isFresh,
	'updated_at' => $row['updated_at'] ?? null,
]);
