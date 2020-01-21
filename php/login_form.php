<?php

if(!session_id())
{
    @session_start();
}

include_once '../php/db.php';
$db = new DB;

include_once "../html/login_form.html";

?>