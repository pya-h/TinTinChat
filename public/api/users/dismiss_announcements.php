<?php
session_start();
require_once __DIR__ . '/../../../tintin-core/includes/db.php';
require_once __DIR__ . '/../../../tintin-core/includes/api_helpers.php';

apiRequireMethod('POST');
$userId = apiRequireAuth();
apiRequireCsrf();

$data = json_decode(file_get_contents('php://input'), true) ?: [];
$lastAnnouncementId = (int) ($data['last_announcement_id'] ?? 0);

if ($lastAnnouncementId <= 0) {
    apiError('INVALID_ID', 'last_announcement_id is required', 400);
}

$stmt = $pdo->prepare('UPDATE users SET last_read_announcement_id = ? WHERE id = ?');
$stmt->execute([$lastAnnouncementId, $userId]);

apiSuccess(['dismissed' => true]);
