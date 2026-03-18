<?php
session_start();
require_once __DIR__ . '/../../includes/db.php';
require_once __DIR__ . '/../../includes/api_helpers.php';

apiRequireMethod('POST');
$userId = apiRequireAuth();
apiRequireCsrf();

$input  = apiGetJsonBody();
$ideaId = (int) ($input['idea_id'] ?? 0);
if ($ideaId <= 0) {
    apiError('INVALID_IDEA', 'Invalid idea ID.', 400);
}

// Owner or superuser can delete
$ideaStmt = $pdo->prepare('SELECT user_id FROM ideas WHERE id = ? LIMIT 1');
$ideaStmt->execute([$ideaId]);
$ideaOwnerId = $ideaStmt->fetchColumn();

if ($ideaOwnerId === false) {
    apiError('IDEA_NOT_FOUND', 'Idea not found.', 404);
}

$isOwner = (int) $ideaOwnerId === $userId;
$username = apiGetUsernameByUserId($pdo, $userId);
$isSuperuser = apiIsSuperuserUsername($username);

if (!$isOwner && !$isSuperuser) {
    apiError('FORBIDDEN', 'You can only delete your own ideas.', 403);
}

$deleteStmt = $pdo->prepare('DELETE FROM ideas WHERE id = ?');
$deleteStmt->execute([$ideaId]);

apiSuccess(['deleted' => true]);
