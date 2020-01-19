<?php

if(!session_id())
{
    @session_start();
}

if(!$_SESSION['login'])
{
    header('Location: ..');
}

include_once "../html/profile.html";

?>