<?php

include 'db.php';

session_start();

$_SESSION;

$user = false;
$created = false;

$logged_in = $_SESSION['logged_in'] ?? false;

if(!$logged_in)
{
    $created = false;
    include 'login_form.html';
}
else if($logged_in)
{
    include 'profile.php';
}
else if(!$created)
{
    include 'create_account.html';
}

?>