<?php

require_once __DIR__ . '/api_helpers.php';

function groupGenerateSharedKey(): string
{
    try {
        return base64_encode(random_bytes(32));
    } catch (Throwable $ex) {
        apiError('GROUP_KEY_GENERATION_FAILED', 'Unable to generate group encryption key', 500);
        throw new RuntimeException('Unable to generate group encryption key', 500, $ex);
    }
}

function groupEncryptSharedKeyForPublicKey(string $rawGroupKey, string $publicKeyPem): string
{
    $publicKey = openssl_pkey_get_public($publicKeyPem);
    if (!$publicKey) {
        apiError('GROUP_KEY_ENCRYPTION_FAILED', 'Invalid public key', 500);
    }

    $encrypted = '';
    $success = openssl_public_encrypt(
        $rawGroupKey,
        $encrypted,
        $publicKey,
        OPENSSL_PKCS1_OAEP_PADDING
    );

    if (!$success || $encrypted === '') {
        apiError('GROUP_KEY_ENCRYPTION_FAILED', 'Failed to encrypt group key', 500);
    }

    return base64_encode($encrypted);
}

function groupDecryptSharedKeyForPrivateKey(string $encryptedGroupKey, string $privateKeyPem): ?string
{
    $privateKey = openssl_pkey_get_private($privateKeyPem);
    if (!$privateKey) {
        return null;
    }

    $cipherBytes = base64_decode($encryptedGroupKey, true);
    if ($cipherBytes === false || $cipherBytes === '') {
        return null;
    }

    $decrypted = '';
    $success = openssl_private_decrypt(
        $cipherBytes,
        $decrypted,
        $privateKey,
        OPENSSL_PKCS1_OAEP_PADDING
    );

    if (!$success || $decrypted === '') {
        return null;
    }

    return $decrypted;
}

function groupGetMemberPublicKey(PDO $pdo, int $userId): string
{
    $stmt = $pdo->prepare('SELECT public_key FROM users WHERE id = ? LIMIT 1');
    $stmt->execute([$userId]);
    $publicKey = (string) ($stmt->fetchColumn() ?: '');

    if ($publicKey === '') {
        apiError('GROUP_MEMBER_PUBLIC_KEY_MISSING', 'Member public key is missing', 400);
    }

    return $publicKey;
}

function groupStoreEncryptedSharedKeyForMember(PDO $pdo, int $groupId, int $userId, string $rawGroupKey): void
{
    $publicKey = groupGetMemberPublicKey($pdo, $userId);
    $encryptedGroupKey = groupEncryptSharedKeyForPublicKey($rawGroupKey, $publicKey);

    $upsertStmt = $pdo->prepare(
        'INSERT INTO group_member_keys (group_id, user_id, encrypted_group_key)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE encrypted_group_key = VALUES(encrypted_group_key)'
    );
    $upsertStmt->execute([$groupId, $userId, $encryptedGroupKey]);
}

function groupTryGetAnyDecryptableSharedKey(PDO $pdo, int $groupId): ?string
{
    $stmt = $pdo->prepare(
        'SELECT gmk.encrypted_group_key, u.private_key
         FROM group_member_keys gmk
         JOIN users u ON u.id = gmk.user_id
         WHERE gmk.group_id = ?'
    );
    $stmt->execute([$groupId]);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($rows as $row) {
        $encryptedKey = (string) ($row['encrypted_group_key'] ?? '');
        $privateKeyPem = (string) ($row['private_key'] ?? '');
        if ($encryptedKey === '' || $privateKeyPem === '') {
            continue;
        }

        $decrypted = groupDecryptSharedKeyForPrivateKey($encryptedKey, $privateKeyPem);
        if ($decrypted !== null) {
            return $decrypted;
        }
    }

    return null;
}

function groupAssignSharedKeyToAllMembers(PDO $pdo, int $groupId, string $rawGroupKey): void
{
    $membersStmt = $pdo->prepare('SELECT user_id FROM group_members WHERE group_id = ?');
    $membersStmt->execute([$groupId]);
    $memberIds = $membersStmt->fetchAll(PDO::FETCH_COLUMN);

    if (!$memberIds) {
        apiError('GROUP_KEY_ASSIGNMENT_FAILED', 'No members found for group key assignment', 500);
    }

    foreach ($memberIds as $memberId) {
        groupStoreEncryptedSharedKeyForMember($pdo, $groupId, (int) $memberId, $rawGroupKey);
    }
}

function groupEnsureMemberHasSharedKey(PDO $pdo, int $groupId, int $userId): void
{
    $existingStmt = $pdo->prepare('SELECT 1 FROM group_member_keys WHERE group_id = ? AND user_id = ? LIMIT 1');
    $existingStmt->execute([$groupId, $userId]);
    if ($existingStmt->fetchColumn()) {
        return;
    }

    $existingKeysCountStmt = $pdo->prepare('SELECT COUNT(*) FROM group_member_keys WHERE group_id = ?');
    $existingKeysCountStmt->execute([$groupId]);
    $existingKeysCount = (int) $existingKeysCountStmt->fetchColumn();

    $rawGroupKey = groupTryGetAnyDecryptableSharedKey($pdo, $groupId);
    if ($rawGroupKey === null) {
        if ($existingKeysCount > 0) {
            $encryptedTextStmt = $pdo->prepare(
                "SELECT 1 FROM messages WHERE group_id = ? AND message_type = 'text' AND message LIKE 'gcm1:%' LIMIT 1"
            );
            $encryptedTextStmt->execute([$groupId]);
            $hasEncryptedText = (bool) $encryptedTextStmt->fetchColumn();

            if ($hasEncryptedText) {
                apiError('GROUP_KEY_RECOVERY_FAILED', 'Unable to recover existing group encryption key', 500);
            }
        }
        $rawGroupKey = groupGenerateSharedKey();
        groupAssignSharedKeyToAllMembers($pdo, $groupId, $rawGroupKey);
        return;
    }

    groupStoreEncryptedSharedKeyForMember($pdo, $groupId, $userId, $rawGroupKey);
}
