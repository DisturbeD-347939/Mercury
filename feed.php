<?php

if(!session_id())
{
    @session_start();

}

include_once "feed.html";

?>