<?php
function sanitizeString($str) {
    return stripslashes(htmlentities(strip_tags($str)));
}

function configSession()
{
    header('Set-Cookie: secure=1; HttpOnly');
    session_start();
    if(isset($_SESSION['user_id'])) {
        return;
    }
    echo <<<_END
        <script>
            const ident = localStorage.getItem('ident');
            fetch(
                'api/get_user_by_ident.php?ident=' + encodeURIComponent(ident)
            ).then((res) => {
                if(res.ok) {
                    res.json().then(() => window.location.reload());
                } 
            }); // this loads session if ident is valid, otherwise ignores.
        </script>
        _END;
}

function setSessionUser(&$user) {
    try {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        $ident = uniqid(time() . '+', true) . session_id();
        $_SESSION['ident'] = $ident;
        return $ident;
    } catch(Exception) {}
    return null;
}