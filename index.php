<?php

if(!session_id())
{
    @session_start();
}

include_once 'db.php';
$db = new DB;

include 'index.html';

?>