<?php
session_start();
require_once __DIR__ . '/../../../../tintin-core/includes/db.php';
require_once __DIR__ . '/../../../../tintin-core/includes/api_helpers.php';

apiRequireMethod('POST');
$userId = apiRequireAuth();
apiRequireCsrf();
apiRequireSuperuserAdmin($pdo, $userId);
session_write_close();

$data = json_decode(file_get_contents('php://input'), true) ?: [];
$title = trim((string) ($data['title'] ?? ''));
$body = trim((string) ($data['body'] ?? ''));

if ($title === '' || strlen($title) > 200) {
    apiError('INVALID_TITLE', 'Title is required and must be under 200 characters', 400);
}

if ($body === '' || strlen($body) > 5000) {
    apiError('INVALID_BODY', 'Body is required and must be under 5000 characters', 400);
}

$stmt = $pdo->prepare('INSERT INTO announcements (user_id, title, body) VALUES (?, ?, ?)');
$stmt->execute([$userId, $title, $body]);

apiSuccess(['id' => (int) $pdo->lastInsertId()]);
