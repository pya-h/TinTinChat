<?php
require_once './db.php';
require_once './auth.php';

/** VERY DANGEROUS! **/
function fuckEverything(&$user, string $word) {
    global $pdo;
    if(!isset($_SESSION['user_id']) || !isset($_SESSION['username']) 
        || !$_SESSION['user_id'] || !$_SESSION['username'] || !$user
        || $_SESSION['user_id'] !== $user['id'] || $_SESSION['username'] !== $user['username'] || !$user['is_admin']) {
        throw new Exception('You can Fuck off freely.');
    }
    $emergency_word = $_ENV['EMERGENCY_WORD'];
    if(!$emergency_word || !len(trim($emergency_word))) {
        throw new Exception('Operation not available!');
    }
    if($word !== $emergency_word) {
        throw new Exception('You can Fuck off freely.');
    }
    try {
        rmdir('../uploads');
        $stmt = $pdo->prepare('DELETE FROM messages; DELETE FROM users')->execute();
        logout();
        logText('Successfully cleared all traces.');
    } catch(Exception $ex) {
        logText($ex);
        throw new Exception('Something went wrong: ' . $ex->getMessage());
    }
}

?>