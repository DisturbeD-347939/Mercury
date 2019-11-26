<?php

if(!session_id())
{
    session_start();
}

$_SESSION['login'] = false;
include 'index.html';

?>