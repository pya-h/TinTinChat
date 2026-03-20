<?php
session_start();
require_once __DIR__ . '/../../includes/db.php';
require_once __DIR__ . '/../../includes/api_helpers.php';

apiRequireMethod('GET');
$userId = apiRequireAuth();
session_write_close();

$page  = max(1, (int) ($_GET['page'] ?? 1));
$limit = min(50, max(5, (int) ($_GET['limit'] ?? 20)));
$offset = ($page - 1) * $limit;

$countStmt = $pdo->prepare('SELECT COUNT(*) FROM ideas');
$countStmt->execute();
$total = (int) $countStmt->fetchColumn();

$stmt = $pdo->prepare('
    SELECT
        i.id,
        i.user_id,
        u.username,
        i.body,
        i.admin_reply,
        i.created_at,
        i.replied_at,
        COALESCE(SUM(CASE WHEN v.vote = 1 THEN 1 ELSE 0 END), 0)  AS likes,
        COALESCE(SUM(CASE WHEN v.vote = -1 THEN 1 ELSE 0 END), 0) AS dislikes,
        MAX(CASE WHEN v.user_id = ? THEN v.vote ELSE NULL END)     AS my_vote
    FROM ideas i
    JOIN users u ON u.id = i.user_id
    LEFT JOIN idea_votes v ON v.idea_id = i.id
    GROUP BY i.id
    ORDER BY (COALESCE(SUM(CASE WHEN v.vote = 1 THEN 1 ELSE 0 END), 0) - COALESCE(SUM(CASE WHEN v.vote = -1 THEN 1 ELSE 0 END), 0)) DESC,
             i.created_at DESC
    LIMIT ' . (int) $limit . ' OFFSET ' . (int) $offset . '
');
$stmt->execute([$userId]);
$ideas = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Determine if current user is superuser
$currentUsername = apiGetUsernameByUserId($pdo, $userId);
$isSuperuser = apiIsSuperuserUsername($currentUsername);

foreach ($ideas as &$idea) {
    $idea['id']       = (int) $idea['id'];
    $idea['user_id']  = (int) $idea['user_id'];
    $idea['likes']    = (int) $idea['likes'];
    $idea['dislikes'] = (int) $idea['dislikes'];
    $idea['my_vote']  = $idea['my_vote'] !== null ? (int) $idea['my_vote'] : null;
    $idea['is_own']   = $idea['user_id'] === $userId;
    // Only superuser can see who posted each idea
    if (!$isSuperuser && !$idea['is_own']) {
        unset($idea['username']);
        unset($idea['user_id']);
    }
}
unset($idea);

$totalPages = max(1, (int) ceil($total / $limit));

apiSuccess([
    'ideas'      => $ideas,
    'pagination' => [
        'total'       => $total,
        'page'        => $page,
        'per_page'    => $limit,
        'total_pages' => $totalPages,
        'has_more'    => $page < $totalPages,
    ],
]);
