<?php

if(!session_id())
{
    @session_start();
}

include_once "../php/db.php";
$db = new DB;

if(!empty($_POST))
{
    $db->delete("users", array("username"=>$_SESSION["user"]["username"]));
    include "../index.php";
}
else
{
    include "../html/delete_account.html";
}

?>