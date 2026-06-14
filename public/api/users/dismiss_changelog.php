<?php
session_start();
require_once __DIR__ . '/../../../tintin-core/includes/db.php';
require_once __DIR__ . '/../../../tintin-core/includes/api_helpers.php';

apiRequireMethod('POST');
$userId = apiRequireAuth();
apiRequireCsrf();

$stmt = $pdo->prepare('UPDATE users SET tips_seen_at = CURRENT_TIMESTAMP WHERE id = ?');
$stmt->execute([$userId]);

apiSuccess(['dismissed' => true]);
