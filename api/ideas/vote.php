<?php
session_start();
require_once __DIR__ . '/../../includes/db.php';
require_once __DIR__ . '/../../includes/api_helpers.php';

apiRequireMethod('POST');
$userId = apiRequireAuth();
apiRequireCsrf();

$input  = apiGetJsonBody();
$ideaId = (int) ($input['idea_id'] ?? 0);
$vote   = (int) ($input['vote']    ?? 0);

if ($ideaId <= 0) {
    apiError('INVALID_IDEA', 'Invalid idea ID.', 400);
}
if (!in_array($vote, [1, -1, 0], true)) {
    apiError('INVALID_VOTE', 'Vote must be 1 (like), -1 (dislike), or 0 (remove).', 400);
}

// Verify idea exists
$checkStmt = $pdo->prepare('SELECT id FROM ideas WHERE id = ?');
$checkStmt->execute([$ideaId]);
if (!$checkStmt->fetchColumn()) {
    apiError('IDEA_NOT_FOUND', 'Idea not found.', 404);
}

if ($vote === 0) {
    $stmt = $pdo->prepare('DELETE FROM idea_votes WHERE idea_id = ? AND user_id = ?');
    $stmt->execute([$ideaId, $userId]);
} else {
    $stmt = $pdo->prepare('
        INSERT INTO idea_votes (idea_id, user_id, vote)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE vote = VALUES(vote), voted_at = CURRENT_TIMESTAMP
    ');
    $stmt->execute([$ideaId, $userId, $vote]);
}

// Return updated counts
$countStmt = $pdo->prepare('
    SELECT
        COALESCE(SUM(CASE WHEN vote = 1 THEN 1 ELSE 0 END), 0) AS likes,
        COALESCE(SUM(CASE WHEN vote = -1 THEN 1 ELSE 0 END), 0) AS dislikes
    FROM idea_votes WHERE idea_id = ?
');
$countStmt->execute([$ideaId]);
$counts = $countStmt->fetch(PDO::FETCH_ASSOC);

apiSuccess([
    'idea_id'  => $ideaId,
    'likes'    => (int) $counts['likes'],
    'dislikes' => (int) $counts['dislikes'],
    'my_vote'  => $vote === 0 ? null : $vote,
]);
