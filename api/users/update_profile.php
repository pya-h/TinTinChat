<?php
session_start();

require_once __DIR__ . '/../../includes/db.php';
require_once __DIR__ . '/../../includes/api_helpers.php';

apiRequireMethod('POST');
$userId = apiRequireAuth();
apiRequireCsrf();

$data = apiGetJsonBody();
$action = trim((string) ($data['action'] ?? ''));

if ($action !== 'username' && $action !== 'password' && $action !== 'bio') {
    apiError('INVALID_ACTION', 'Invalid profile update action', 400);
}

if ($action === 'bio') {
    $bio = trim((string) ($data['bio'] ?? ''));
    if (strlen($bio) > 255) {
        apiError('INVALID_BIO', 'Bio must be 255 characters or fewer', 400);
    }
    $bioValue = $bio === '' ? null : $bio;
    $stmt = $pdo->prepare('UPDATE users SET bio = ? WHERE id = ?');
    if (!$stmt->execute([$bioValue, $userId])) {
        apiError('DB_SAVE_FAILED', 'Could not update bio', 500);
    }
    apiSuccess(['message' => 'Bio updated successfully', 'bio' => (string) ($bioValue ?? '')]);
}

if ($action === 'username') {
    $newUsername = apiNormalizeUsername((string) ($data['username'] ?? ''), 'INVALID_USERNAME');

    $currentUserStmt = $pdo->prepare('SELECT username FROM users WHERE id = ? LIMIT 1');
    $currentUserStmt->execute([$userId]);
    $currentUsername = (string) ($currentUserStmt->fetchColumn() ?: '');

    if ($currentUsername === '') {
        apiError('UNAUTHORIZED', 'User not found', 401);
    }

    if (strcasecmp($currentUsername, $newUsername) === 0) {
        $_SESSION['username'] = $newUsername;
        apiSuccess([
            'message' => 'Username unchanged',
            'username' => $newUsername,
        ]);
    }

    $existsStmt = $pdo->prepare('SELECT id FROM users WHERE username = ? LIMIT 1');
    $existsStmt->execute([$newUsername]);
    $existingId = (int) ($existsStmt->fetchColumn() ?: 0);
    if ($existingId > 0 && $existingId !== $userId) {
        apiError('USERNAME_TAKEN', 'This username is already taken', 409);
    }

    $updateStmt = $pdo->prepare('UPDATE users SET username = ? WHERE id = ?');
    try {
        if (!$updateStmt->execute([$newUsername, $userId])) {
            apiError('DB_SAVE_FAILED', 'Could not update username', 500);
        }
    } catch (PDOException $e) {
        if (str_contains((string) ($e->errorInfo[2] ?? ''), 'Duplicate')) {
            apiError('USERNAME_TAKEN', 'This username is already taken', 409);
        }
        apiError('DB_SAVE_FAILED', 'Could not update username', 500);
    }

    $_SESSION['username'] = $newUsername;
    apiSuccess([
        'message' => 'Username updated successfully',
        'username' => $newUsername,
    ]);
}

$currentPassword = (string) ($data['current_password'] ?? '');
$newPassword = (string) ($data['new_password'] ?? '');
$confirmPassword = (string) ($data['confirm_password'] ?? '');

if ($currentPassword === '' || $newPassword === '' || $confirmPassword === '') {
    apiError('MISSING_PASSWORD_FIELDS', 'Please provide current, new, and confirm password fields', 400);
}

if ($newPassword !== $confirmPassword) {
    apiError('PASSWORD_CONFIRM_MISMATCH', 'New password and confirmation do not match', 400);
}

if (
    strlen($newPassword) < 8 ||
    !preg_match('/[0-9]/', $newPassword) ||
    !preg_match('/[a-zA-Z]/', $newPassword) ||
    !preg_match('/[^a-zA-Z0-9]/', $newPassword)
) {
    apiError('INVALID_PASSWORD', 'Password must be at least 8 characters and include letter, number, and special character', 400);
}

$userStmt = $pdo->prepare('SELECT password_hash FROM users WHERE id = ? LIMIT 1');
$userStmt->execute([$userId]);
$currentHash = (string) ($userStmt->fetchColumn() ?: '');
if ($currentHash === '') {
    apiError('UNAUTHORIZED', 'User not found', 401);
}

if (!password_verify($currentPassword, $currentHash)) {
    apiError('INVALID_CURRENT_PASSWORD', 'Current password is incorrect', 403);
}

$newHash = password_hash($newPassword, PASSWORD_DEFAULT);
$updatePasswordStmt = $pdo->prepare('UPDATE users SET password_hash = ? WHERE id = ?');
if (!$updatePasswordStmt->execute([$newHash, $userId])) {
    apiError('DB_SAVE_FAILED', 'Could not update password', 500);
}

apiSuccess([
    'message' => 'Password updated successfully',
]);
