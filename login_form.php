<?php

include 'db.php';

$db = new DB;

if(!session_id())
{
    @session_start();
}

if(!empty($_POST))
{
    $result = $db->login($_POST['log_in']['email'], hash('sha256', $_POST['log_in']['password']));
    if($result[0])
    {
        $_SESSION['user'] = $result[1];
        $_SESSION['login'] = true;
        include 'profile.html';
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