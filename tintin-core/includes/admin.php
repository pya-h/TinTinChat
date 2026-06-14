<?php
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth.php';

function emergencyLog(mixed $text): void
{
    $logFile = fopen(__DIR__ . '/../emergency.log', 'a');
    if ($logFile) {
        fwrite($logFile, date('Y-m-d H:i:s') . '  =>  ' . json_encode($text) . "\n\n");
        fclose($logFile);
    }
}

function performEmergencyReset(array &$user, string $word): void {
    global $pdo;

    if (!isset($_SESSION['user_id']) || !isset($_SESSION['username'])
        || !$_SESSION['user_id'] || !$_SESSION['username'] || !$user
        || ($_SESSION['user_id'] !== $user['id']) || ($_SESSION['username'] !== $user['username']) || !$user['is_admin']) {
        throw new Exception('Access denied.');
    }
    $emergency_word = $_ENV['EMERGENCY_WORD'];
    if (!$emergency_word || !strlen(trim($emergency_word))) {
        throw new Exception('Operation not available.');
    }
    if ($word !== $emergency_word) {
        throw new Exception('Access denied.');
    }
    try {
        removeDirectoryTree(__DIR__ . '/../uploads');
        $pdo->exec('DELETE FROM messages');
        $pdo->exec('DELETE FROM users');
        logout();
        emergencyLog('Successfully cleared all traces.');
    } catch (Exception $ex) {
        emergencyLog($ex);
        throw new Exception('Operation failed. Check server logs.');
    }
}

function removeDirectoryTree(string $path): void {
    if (is_dir($path)) {
        $files = scandir($path);
        foreach ($files as $file) {
            try {
                if ($file != '.' && $file != '..') {
                    removeDirectoryTree($path . '/' . $file);
                }
            } catch (Exception $ex) {
                emergencyLog('Failed removing path: ' . $path . '/' . $file . ' => ' . $ex->getMessage());
            }
        }
        rmdir($path);
    } else {
        unlink($path);
    }
}
