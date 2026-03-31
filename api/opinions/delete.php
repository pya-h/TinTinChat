<?php
session_start();

require_once __DIR__ . '/../../includes/db.php';
require_once __DIR__ . '/../../includes/api_helpers.php';

apiRequireMethod('POST');
$currentUserId = apiRequireAuth();
apiRequireCsrf();

$data = apiGetJsonBody();
$opinionId = (int) ($data['opinion_id'] ?? 0);

if ($opinionId <= 0) {
    apiError('INVALID_ID', 'Invalid opinion ID', 400);
}

$stmt = $pdo->prepare('DELETE FROM user_opinions WHERE id = ? AND author_user_id = ?');
$stmt->execute([$opinionId, $currentUserId]);

if ($stmt->rowCount() === 0) {
    apiError('NOT_FOUND', 'Opinion not found', 404);
}

apiSuccess(['message' => 'Opinion deleted']);
