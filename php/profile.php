<?php

if(!session_id())
{
    @session_start();

}

include_once "../html/profile.html";

?>