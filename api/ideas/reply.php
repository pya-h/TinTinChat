<?php
session_start();
require_once __DIR__ . '/../../includes/db.php';
require_once __DIR__ . '/../../includes/api_helpers.php';

apiRequireMethod('POST');
$userId = apiRequireAuth();
apiRequireCsrf();

// Check admin
$adminStmt = $pdo->prepare('SELECT is_admin FROM users WHERE id = ? LIMIT 1');
$adminStmt->execute([$userId]);
if (!(bool) $adminStmt->fetchColumn()) {
    apiError('FORBIDDEN', 'Only admins can reply to ideas.', 403);
}

$ideaId = (int) ($_POST['idea_id'] ?? 0);
$reply  = trim((string) ($_POST['reply'] ?? ''));

if ($ideaId <= 0) {
    apiError('INVALID_IDEA', 'Invalid idea ID.', 400);
}
if ($reply === '') {
    apiError('EMPTY_REPLY', 'Reply cannot be empty.', 400);
}
if (mb_strlen($reply) > 2000) {
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
