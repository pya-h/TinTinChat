<?php
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth.php';

function logText($text) {
    $log_file = fopen("../log.fux", "a");
    fwrite($log_file, date('Y-m-d H:i:s'). '  =>  ' . json_encode($text) . "\n\n");
    fclose($log_file);
}


/** VERY DANGEROUS! **/
function fuckEverything(&$user, string $word) {
    global $pdo;
    if(!isset($_SESSION['user_id']) || !isset($_SESSION['username']) 
        || !$_SESSION['user_id'] || !$_SESSION['username'] || !$user
        || $_SESSION['user_id'] !== $user['id'] || $_SESSION['username'] !== $user['username'] || !$user['is_admin']) {
        throw new Exception('You can Fuck off freely.');
    }
    $emergency_word = $_ENV['EMERGENCY_WORD'];
    if(!$emergency_word || !strlen(trim($emergency_word))) {
        throw new Exception('Operation not available!');
    }
    if($word !== $emergency_word) {
        throw new Exception('You can Fuck off freely.');
    }
    try {
        forceRemoveFiles(__DIR__ . '/../uploads');
        $stmt = $pdo->prepare('DELETE FROM messages; DELETE FROM users')->execute();
        logout();
        logText('Successfully cleared all traces.');
    } catch(Exception $ex) {
        logText($ex);
        throw new Exception('Something went wrong: ' . $ex->getMessage());
    }
}

function forceRemoveFiles($path) {
    if (is_dir($path)) {
        $files = scandir($path);    
        foreach ($files as $file) {
            try {
                if ($file != '.' && $file != '..') {
                    forceRemoveFiles($path . '/' . $file);
                }
            } catch(Exception $ex) {
                logText('Failed removing directory/files at: ' . $path . '/' . $file . ' => ' . $ex->getMessage());
            }
        }
        rmdir($path);
    } else {
        unlink($path);
    }
}
?>