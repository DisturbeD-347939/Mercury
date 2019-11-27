<?php

if(!session_id())
{
    @session_start();
}

include_once "db.php";
$db = new DB;

if(!empty($_POST))
{
    $db->delete("users", array("username"=>$_SESSION["user"]["username"]));
    include "index.php";
}
else
{
    include "delete_account.html";
}

?>