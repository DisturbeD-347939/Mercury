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
            mkdir("./Users/" . $result[1]);
            copy('https://i.imgur.com/mCHMpLT.png?3', './Users/' . $result[1] . '/profilePicture.png');
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