<?php
function sanitizeString($str) {
    return stripslashes(htmlentities(strip_tags($str)));
}

function configSession()
{
    header('Set-Cookie: secure=1; HttpOnly');
    session_start();
    echo <<<_END
        <script>
            const ident = localStorage.getItem('ident');
            await fetch(
                'api/get_user_by_ident.php?ident=' encodeURIComponent(ident)
            ); // this loads session if ident is valid, otherwise ignores.
        </script>
        _END;
}
