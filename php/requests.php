<?php 

if(!session_id())
{
    @session_start();
}

include_once '../php/db.php';
$db = new DB;

//GET REQUESTS
if(@$_REQUEST["search"])
{
    $names = [];
    $getNames = $db->getNames($_SESSION["user"]["id"]);
    foreach($getNames as $k => $v)
    {
        array_push($names, $v["first_name"] . " " . $v["surname"] . " @" . $v["username"] . " " . $v["id"]);
    }

    $q = $_REQUEST["search"];

    $hint = "";

    if($q != "")
    {
        $q = strtolower($q);
        foreach($names as $name)
        {
            if(strpos(strtolower($name), $q) !== false && $q != "@")
            {
                if($hint == "")
                {
                    $hint = $name;
                }
                else
                {
                    $hint .= ", $name";
                }
            } 
        }
    }

    echo json_encode(array('hint'=>$hint));
}

else if(@$_REQUEST["del"])
{
    $q = $_REQUEST['del'];
    
    $result = $db->delete("posts", array("id"=> $q));

    echo json_encode(array('result'=>$result));
}

else if(@$_REQUEST["searchProfile"])
{
    $result = $db->searchUser($_REQUEST["searchProfile"]);

    $_SESSION["searchProfile"] = $result;

    echo json_encode(array('result'=>$result));
}

else if(@$_REQUEST["follow"])
{
    $result = $db->add("follows", array("followerID"=>$_SESSION["user"]["id"], "userID"=>$_REQUEST["follow"]));

    echo json_encode(array('result'=>$result));
}

else if(@$_REQUEST["unfollow"])
{
    $result = $db->delete("follows", array("userID"=>$_REQUEST["unfollow"], "followerID"=>$_SESSION["user"]["id"]));

    echo json_encode(array('result'=>$result));
}

else if(@$_REQUEST["followerID"] && @$_REQUEST["userID"])
{
    $result = $db->following($_REQUEST["followerID"], $_REQUEST["userID"]);

    echo json_encode(array('result' => $result));
}

else if(@$_REQUEST["getPosts"])
{
    $result = $db->getMultiplePosts($_REQUEST["getPosts"]);

    echo json_encode(array('result'=>$result));
}

//POST REQUESTS
if(@$_POST['register'])
{
    $register = $_POST['register'];
    $register['password'] = hash('sha256', $register['password']);
    if(!$db->repeated($register))
    {
        $result = $db->add("users", $register);
        if($result[0])
        {
            $_SESSION['id'] = $result[1];
            mkdir("../Users/" . $result[1]);
            copy('https://i.imgur.com/mCHMpLT.png?3', '../Users/' . $result[1] . '/profilePicture.png');
            echo "Account created, log in with your details above!";
            $_POST = array();
            include '../php/login_form.php';
        }
        else
        {
            echo "Wrong query!";
        }
    }
    else
    {
        echo "Existing!!";
        include '../html/create_account.html';
    }
}

else if(@$_POST['post'])
{
    $post = $_POST['post'];
    $db->add("posts", array("content"=>$post["content"], "title"=>$post["title"], "userID"=>$_SESSION["user"]["id"], "timestamp"=>time()));

    $result = $db->getPosts($_SESSION["user"]["id"]);

    echo json_encode(array('result' => $result));
}

?>