<?php

if(!session_id())
{
    @session_start();

}

include "profile.html";

?>