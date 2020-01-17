<?php 

if(!session_id())
{
    @session_start();
}

include_once '../php/db.php';
$db = new DB;

/*************************************GET REQUESTS*************************************/

//Search request
if(@$_REQUEST["search"])
{
    $names = [];
    $getNames = $db->searchNames($_SESSION["user"]["id"]);
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

//Delete post request
else if(@$_REQUEST["del"])
{
    $q = $_REQUEST['del'];
    
    $result = $db->delete("posts", array("id"=> $q));

    echo json_encode(array('result'=>$result));
}

//Search profile request
else if(@$_REQUEST["searchProfile"])
{
    $result = $db->searchUser($_REQUEST["searchProfile"]);

    $_SESSION["searchProfile"] = $result;

    echo json_encode(array('result'=>$result));
}

//Follow request
else if(@$_REQUEST["follow"])
{
    $result = $db->add("follows", array("followerID"=>$_SESSION["user"]["id"], "userID"=>$_REQUEST["follow"]));

    echo json_encode(array('result'=>$result));
}

//Unfollow request
else if(@$_REQUEST["unfollow"])
{
    $result = $db->delete("follows", array("userID"=>$_REQUEST["unfollow"], "followerID"=>$_SESSION["user"]["id"]));

    echo json_encode(array('result'=>$result));
}

//Following? request
else if(@$_REQUEST["followerID"] && @$_REQUEST["userID"])
{
    $result = $db->following($_REQUEST["followerID"], $_REQUEST["userID"]);

    echo json_encode(array('result' => $result));
}

//Get posts from user request
else if(@$_REQUEST["getPosts"])
{
    $result = $db->getMultiplePosts($_REQUEST["getPosts"]);

    echo json_encode(array('result'=>$result));
}

else if(@$_REQUEST["getNames"])
{
    $result = $db->getMultipleIDs($_REQUEST["getNames"]);

    echo json_encode(array('result'=>$result));
}

else if(@$_REQUEST["getProfilePic"])
{
    //Separate ids into an array
    $ids = explode(",",$_REQUEST["getProfilePic"]);
    $images = [];

    for($i = 0; $i < sizeof($ids); $i++)
    {
        $pic = "../Users/" . $ids[$i] . "/profilePicture.png";
        $picData = base64_encode(file_get_contents($pic));
        $data = 'data: '.mime_content_type($pic).';base64,'.$picData;
        $tempArray = [$ids[$i], $data];
        
        array_push($images, $tempArray);
    }

    echo json_encode(array('result'=>$images));
}

/*************************************POST REQUESTS*************************************/

//Register request
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

//New post request
else if(@$_POST['post'])
{
    $post = $_POST['post'];
    $db->add("posts", array("content"=>$post["content"], "title"=>$post["title"], "userID"=>$_SESSION["user"]["id"], "timestamp"=>time()));

    $result = $db->getPosts($_SESSION["user"]["id"]);

    echo json_encode(array('result' => $result));
}

//Delete account request
else if(@$_POST['deleteAccount'])
{
    $db->delete("users", array("username"=>$_SESSION["user"]["username"]));
    header('Location: ../index.php');
}

//Log in request
else if(@$_POST['log_in'])
{
    $data = $_POST['log_in'];
    $result = $db->login($data['email'], hash('sha256', $data['password']));
    if($result[0])
    {
        $_SESSION['user'] = $result[1];
        $_SESSION['login'] = true;
        header('Location: ../php/profile.php');
    }
    else
    {
        echo "Incorrect details, try again!";
        header('Location: ../html/login_form.html');
    }
}

?>