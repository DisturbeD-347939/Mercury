<?php

if(!session_id())
{
    @session_start();

}

include_once '../php/db.php';
$db = new DB;

//Get posts from user searched
$result = $db->getPosts($_SESSION["searchProfile"]["id"]);

include_once '../html/searchProfile.html';

?>