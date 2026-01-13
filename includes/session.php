<?php
function configSession() {
    session_start();
    header('Set-Cookie: secure=1; HttpOnly');
}
