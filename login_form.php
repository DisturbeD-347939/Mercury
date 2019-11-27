<?php

if(!session_id())
{
    @session_start();
}

include_once 'db.php';
$db = new DB;

if(!empty($_POST))
{
    $result = $db->login($_POST['log_in']['email'], hash('sha256', $_POST['log_in']['password']));
    if($result[0])
    {
        $_SESSION['user'] = $result[1];
        $_SESSION['login'] = true;
        include 'profile.php';
    }
    else
    {
        echo "Incorrect details, try again!";
        include 'login_form.html';
    }
}
else
{
    include 'login_form.html';
}

?>