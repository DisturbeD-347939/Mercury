<?php

if(!session_id())
{
    @session_start();
}

include_once '../php/db.php';
$db = new DB;

if(!empty($_POST))
{
    $result = $db->login($_POST['log_in']['email'], hash('sha256', $_POST['log_in']['password']));
    if($result[0])
    {
        $_SESSION['user'] = $result[1];
        $_SESSION['login'] = true;
        header('Location: ../php/profile.php');
    }
    else
    {
        echo "Incorrect details, try again!";
        include '../html/login_form.html';
    }
}
else
{
    include '../html/login_form.html';
}

?>