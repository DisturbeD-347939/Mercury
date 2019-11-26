<?php

include 'db.php';

$db = new DB;

if(!session_id())
{
    @session_start();
}

if(!empty($_POST))
{
    $register = $_POST['register'];
    $register['password'] = hash('sha256', $register['password']);
    if(!$db->repeated($register))
    {
        $result = $db->add("users", $register);
        if($result[0])
        {
            $_SESSION['id'] = $result[1];
            echo "Account created, log in with your details above!";
            include 'login_form.html';
        }
        else
        {
            echo "Wrong query!";
        }
    }
    else
    {
        echo "Existing!!";
        include 'create_account.html';
    }
}
else
{
    include 'create_account.php';
}


?>