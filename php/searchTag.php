<?php

if(!session_id())
{
    @session_start();

}

include_once '../php/db.php';
$db = new DB;

//Get posts from user searched
$result = $db->getTags();

include_once '../html/searchTag.html';

?>