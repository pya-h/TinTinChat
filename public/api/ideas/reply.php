<?php
session_start();
require_once __DIR__ . '/../../../tintin-core/includes/db.php';
require_once __DIR__ . '/../../../tintin-core/includes/api_helpers.php';

apiRequireMethod('POST');
$userId = apiRequireAuth();
apiRequireCsrf();

// Only superuser can reply to ideas
$username = apiGetUsernameByUserId($pdo, $userId);
if (!apiIsSuperuserUsername($username)) {
    apiError('FORBIDDEN', 'Only the superuser can reply to ideas.', 403);
}

$input  = apiGetJsonBody();
$ideaId = (int) ($input['idea_id'] ?? 0);
$reply  = trim((string) ($input['reply'] ?? ''));

if ($ideaId <= 0) {
    apiError('INVALID_IDEA', 'Invalid idea ID.', 400);
}
if ($reply === '') {
    apiError('EMPTY_REPLY', 'Reply cannot be empty.', 400);
}
if (strlen($reply) > 2000) {
    apiError('REPLY_TOO_LONG', 'Reply must be 2000 characters or fewer.', 400);
}

$checkStmt = $pdo->prepare('SELECT id FROM ideas WHERE id = ?');
$checkStmt->execute([$ideaId]);
if (!$checkStmt->fetchColumn()) {
    apiError('IDEA_NOT_FOUND', 'Idea not found.', 404);
}

$stmt = $pdo->prepare('UPDATE ideas SET admin_reply = ?, replied_at = CURRENT_TIMESTAMP WHERE id = ?');
$stmt->execute([$reply, $ideaId]);

apiSuccess(['idea_id' => $ideaId]);
