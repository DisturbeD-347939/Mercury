<?php

if(!session_id())
{
    @session_start();
}

include_once 'php/db.php';
$db = new DB;


Header('location: html/home.html') ;

?>