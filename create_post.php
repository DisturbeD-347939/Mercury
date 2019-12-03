<?php

if(!session_id())
{
    @session_start();
}

include_once "db.php";
$db = new DB;

if(!empty($_POST))
{
    $db->add("posts", array("content"=>$_POST["content"], "title"=>$_POST["title"], "userID"=>$_SESSION["user"]["id"]));
    header("Location: profile.php");
}

?>