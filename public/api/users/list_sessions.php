<?php
session_start();
require_once __DIR__ . '/../../../tintin-core/includes/db.php';
require_once __DIR__ . '/../../../tintin-core/includes/session.php';
require_once __DIR__ . '/../../../tintin-core/includes/api_helpers.php';

apiRequireMethod('GET');
$userId = apiRequireAuth();
apiRequireBanCheck($pdo, $userId);

$currentToken = $_SESSION['ident'] ?? '';
$sessions = listUserSessions($userId);

$result = [];
foreach ($sessions as $s) {
    $createdTs = strtotime($s['created_at']);
    $ageHours = (time() - $createdTs) / 3600;
    $isCurrent = ($s['session_token'] === $currentToken);

    $result[] = [
        'id'             => (int) $s['id'],
        'ip_address'     => $s['ip_address'],
        'user_agent'     => $s['user_agent'],
        'created_at'     => $s['created_at'],
        'last_active_at' => $s['last_active_at'],
        'is_current'     => $isCurrent,
        'can_revoke'     => !$isCurrent && $ageHours >= 12,
    ];
}

apiSuccess(['sessions' => $result]);
