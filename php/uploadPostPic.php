<?php

if ( 0 >= @$_FILES['file']['error'] ) 
{
    move_uploaded_file(@$_FILES['file']['tmp_name'], '../posts/' . @$_POST['id'] . ".png");
}

?>