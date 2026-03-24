<?php
session_start();
require_once __DIR__ . '/../../../includes/db.php';
require_once __DIR__ . '/../../../includes/api_helpers.php';

apiRequireMethod('POST');
$userId = apiRequireAuth();
apiRequireCsrf();
apiRequireSuperuserAdmin($pdo, $userId);
session_write_close();

$data = json_decode(file_get_contents('php://input'), true) ?: [];
$announcementId = (int) ($data['id'] ?? 0);

if ($announcementId <= 0) {
    apiError('INVALID_ID', 'Invalid announcement ID', 400);
}

$stmt = $pdo->prepare('DELETE FROM announcements WHERE id = ?');
$stmt->execute([$announcementId]);

if ($stmt->rowCount() === 0) {
    apiError('NOT_FOUND', 'Announcement not found', 404);
}

apiSuccess([]);
