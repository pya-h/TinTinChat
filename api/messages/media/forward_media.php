<?php
/**
 * Forward a media message without re-uploading the file.
 *
 * The client extracts the original AES key K₁ from the source envelope (using
 * its own private/group key), re-wraps K₁ for the new recipient (RSA-OAEP for
 * DMs, group AES-GCM for groups), and sends the new envelopes here.
 * The encrypted file blob on disk is NOT touched — the new row simply points to
 * the same file.  No duplicate file is written, no re-encryption of the blob.
 *
 * POST fields:
 *   source_message_id          (int, required) – the message being forwarded
 *   message                    (string, required) – new envelope for recipient
 *   message_for_sender         (string, required) – new envelope for sender
 *   target                     (string) – target username (DM)
 *   group_id                   (int)    – group ID (group chat)
 *   grouped_with               (int|"self") – for preserving photo album structure
 *
 * Response: { message_id, grouped_with }  (mirrors send_image.php)
 */
session_start();
require_once __DIR__ . '/../../../includes/db.php';
require_once __DIR__ . '/../../../includes/api_helpers.php';
require_once __DIR__ . '/../../../includes/group_helpers.php';
require_once __DIR__ . '/../../../includes/block_helpers.php';

apiRequireMethod('POST');
$userId = apiRequireAuth();
apiRequireCsrf();
session_write_close();

$sourceMessageId = isset($_POST['source_message_id']) && is_numeric($_POST['source_message_id'])
    ? (int) $_POST['source_message_id']
    : null;
if (!$sourceMessageId) {
    apiError('MISSING_PARAMETERS', 'source_message_id is required', 400);
}

$messageForRecipient = trim((string) ($_POST['message'] ?? ''));
$messageForSender    = trim((string) ($_POST['message_for_sender'] ?? ''));
if ($messageForRecipient === '' || $messageForSender === '') {
    apiError('MISSING_PARAMETERS', 'Missing encrypted media envelope', 400);
}

$groupId         = groupParseId($_POST['group_id'] ?? null);
$targetUsername  = $groupId > 0
    ? ''
    : apiNormalizeUsername($_POST['target'] ?? null, 'INVALID_TARGET_USERNAME');

$rawGroupedWith    = trim((string) ($_POST['grouped_with'] ?? ''));
$groupedWithSelf   = ($rawGroupedWith === 'self');
$groupedWith       = (!$groupedWithSelf && $rawGroupedWith !== '' && is_numeric($rawGroupedWith))
    ? (int) $rawGroupedWith
    : null;

$receiverId = null;
if ($groupId > 0) {
    groupRequireMembership($pdo, $groupId, $userId);
} else {
    $stmt = $pdo->prepare('SELECT id FROM users WHERE username = ? LIMIT 1');
    $stmt->execute([$targetUsername]);
    $targetUser = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$targetUser) {
        apiError('TARGET_NOT_FOUND', 'Target user not found', 404);
    }
    $receiverId = (int) $targetUser['id'];
    blockEnforceSenderAllowed($pdo, $userId, $receiverId);
}

$groupMemberColumns = apiGetTableColumns($pdo, 'group_members');
$activeMemberClause = array_key_exists('left_at', $groupMemberColumns)
        ? 'AND left_at IS NULL'
        : '';

$srcStmt = $pdo->prepare(
        "SELECT id, message_type, image_file_path, voice_file_path, any_file_path, file_size
         FROM messages
         WHERE id = ?
             AND (
                 sender_id = ?
                 OR receiver_id = ?
                 OR group_id IN (
                         SELECT group_id FROM group_members WHERE user_id = ? {$activeMemberClause}
                 )
             )
         LIMIT 1"
);
$srcStmt->execute([$sourceMessageId, $userId, $userId, $userId]);
$srcRow = $srcStmt->fetch(PDO::FETCH_ASSOC);
if (!$srcRow) {
    apiError('SOURCE_NOT_FOUND', 'Source message not found or not accessible', 404);
}

$messageType = (string) ($srcRow['message_type'] ?? '');
$allowedTypes = ['image', 'voice', 'file', 'video'];
if (!in_array($messageType, $allowedTypes, true)) {
    apiError('UNSUPPORTED_TYPE', 'Source message type cannot be forwarded via this endpoint', 400);
}

$filePath = '';
switch ($messageType) {
    case 'image': $filePath = (string) ($srcRow['image_file_path'] ?? ''); break;
    case 'voice': $filePath = (string) ($srcRow['voice_file_path'] ?? ''); break;
    default:      $filePath = (string) ($srcRow['any_file_path']   ?? ''); break;
}
if ($filePath === '') {
    apiError('SOURCE_FILE_MISSING', 'Source message has no associated file', 400);
}

$fileSize = (int) ($srcRow['file_size'] ?? 0);

if ($groupedWith !== null) {
    if ($messageType !== 'image') {
        apiError('INVALID_GROUPED_WITH', 'grouped_with is only valid for image messages', 400);
    }
    if ($groupId > 0) {
        $gwStmt = $pdo->prepare("SELECT id FROM messages WHERE id = ? AND group_id = ? AND sender_id = ? AND message_type = 'image' LIMIT 1");
        $gwStmt->execute([$groupedWith, $groupId, $userId]);
    } else {
        $gwStmt = $pdo->prepare("SELECT id FROM messages WHERE id = ? AND sender_id = ? AND receiver_id = ? AND message_type = 'image' LIMIT 1");
        $gwStmt->execute([$groupedWith, $userId, $receiverId]);
    }
    if (!$gwStmt->fetch()) {
        apiError('INVALID_GROUPED_WITH', 'Invalid group reference', 400);
    }
}

try {
    $pdo->beginTransaction();

    // Enforce per-group photo limit (max 10)
    if ($groupedWith !== null) {
        $countStmt = $pdo->prepare('SELECT COUNT(*) FROM messages WHERE grouped_with = ? FOR UPDATE');
        $countStmt->execute([$groupedWith]);
        if ((int) $countStmt->fetchColumn() >= 10) {
            $pdo->rollBack();
            apiError('GROUP_LIMIT_REACHED', 'Maximum of 10 photos per group', 400);
        }
    }

    switch ($messageType) {
        case 'image':
            $stmt = $pdo->prepare(
                "INSERT INTO messages
                    (sender_id, receiver_id, group_id, message, message_for_sender, message_type,
                     image_file_path, file_size, forwarded_from_message_id, forwarded_by_user_id, grouped_with)
                 VALUES (?, ?, ?, ?, ?, 'image', ?, ?, ?, ?, ?)"
            );
            $ok = $stmt->execute([
                $userId,
                $receiverId,
                $groupId > 0 ? $groupId : null,
                $messageForRecipient,
                $messageForSender,
                basename($filePath),   // store just the filename, consistent with send_image.php
                $fileSize,
                $sourceMessageId,
                $userId,
                $groupedWith,
            ]);
            break;

        case 'voice':
            $stmt = $pdo->prepare(
                "INSERT INTO messages
                    (sender_id, receiver_id, group_id, message, message_for_sender, message_type,
                     voice_file_path, file_size, forwarded_from_message_id, forwarded_by_user_id)
                 VALUES (?, ?, ?, ?, ?, 'voice', ?, ?, ?, ?)"
            );
            $ok = $stmt->execute([
                $userId,
                $receiverId,
                $groupId > 0 ? $groupId : null,
                $messageForRecipient,
                $messageForSender,
                basename($filePath),
                $fileSize,
                $sourceMessageId,
                $userId,
            ]);
            break;

        default: // file / video
            $stmt = $pdo->prepare(
                "INSERT INTO messages
                    (sender_id, receiver_id, group_id, message, message_for_sender, message_type,
                     any_file_path, file_size, forwarded_from_message_id, forwarded_by_user_id)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
            );
            $ok = $stmt->execute([
                $userId,
                $receiverId,
                $groupId > 0 ? $groupId : null,
                $messageForRecipient,
                $messageForSender,
                $messageType,  // 'file' or 'video'
                basename($filePath),
                $fileSize,
                $sourceMessageId,
                $userId,
            ]);
            break;
    }

    if (!$ok) {
        $pdo->rollBack();
        apiError('SEND_FAILED', 'Failed to create forwarded message', 409);
    }

    $newMessageId = (int) $pdo->lastInsertId();

    // For the first photo in a group ("self"), set grouped_with = own id
    if ($groupedWithSelf && $messageType === 'image') {
        $pdo->prepare('UPDATE messages SET grouped_with = ? WHERE id = ?')
            ->execute([$newMessageId, $newMessageId]);
        $groupedWith = $newMessageId;
    }

    $pdo->commit();

    apiSuccess([
        'message_id'   => $newMessageId,
        'grouped_with' => $groupedWith,
        'message'      => 'Message forwarded successfully',
    ]);
} catch (PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    apiError('DB_FAILED', 'Database error while forwarding message', 500);
}
