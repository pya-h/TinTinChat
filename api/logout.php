<?php
require_once '../includes/db.php';

session_start();
clearPossibleLoginSession();
session_destroy();
echo <<<_END
    <script>
        localStorage.clear();
        window.location.href = '/';
    </script>
_END;
// header('Location: ../index.php');
exit;
