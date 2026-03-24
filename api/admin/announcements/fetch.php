<?php
session_start();
require_once __DIR__ . '/../../../includes/db.php';
require_once __DIR__ . '/../../../includes/api_helpers.php';

apiRequireMethod('GET');
$userId = apiRequireAuth();
session_write_close();

$stmt = $pdo->prepare('SELECT a.id, a.title, a.body, a.created_at, u.username AS author FROM announcements a JOIN users u ON u.id = a.user_id ORDER BY a.created_at DESC LIMIT 50');
$stmt->execute();
$announcements = $stmt->fetchAll(PDO::FETCH_ASSOC);

apiSuccess(['announcements' => $announcements]);
