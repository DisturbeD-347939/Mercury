<?php

include 'db.php';

session_start();

$_SESSION;

$user = false;
$created = false;

if(!empty($_POST))
{
    //REGISTER FORM
    if(isset($_POST['register']))
    {
        $regist_details = $_POST['register'];
        $result = insert_user($regist_details);
        $created = $result[0];
        if(!$result[0])
        {
            if(sizeof($result) > 1)
            {
                $errors = [];
                foreach($result[1] as $k => $v)
                {
                    if($v == "email" || $v == "username")
                    {
                        array_push($errors, $v);
                    }
                }
                if(sizeof($errors) > 1)
                {
                    echo "Both your $errors[0] and $errors[1] are taken!";
                }
                else 
                {
                    echo "Sorry but your $errors[0] is already taken!";
                }
            }
            else 
            {
                echo "Failed to create an account! Contact me at ricardo.graca17@bathspa.ac.uk";
            }
        }
        else 
        {
            echo "Account created! Try login in with your credentials!";
        }
    }
}

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