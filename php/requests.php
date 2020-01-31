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

    if($_REQUEST['post'])
    {
        $result = $db->delete("posts", array("id"=> $q));
    }
    else
    {
        $result = $db->delete("comments", array("id"=> $q));
    }

    echo json_encode(array('result'=>$result));
}

//Search profile request
else if(@$_REQUEST["searchProfile"])
{
    $result = $db->searchUser($_REQUEST["searchProfile"]);

    $_SESSION["searchProfile"] = $result;

    if($_REQUEST["searchProfile"] != $_SESSION["user"]["id"])
    {
        echo json_encode(array('result'=>$result));
    }
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
    $result = $db->deleteMultiple("follows", array("userID"=>$_REQUEST["unfollow"], "followerID"=>$_SESSION["user"]["id"]));

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

else if(@$_REQUEST["getLikes"])
{
    $result = $db->getLikes($_REQUEST["getLikes"]);

    echo json_encode(array('result'=>$result));
}

else if(@$_REQUEST["getPhoto"])
{
    $id = $_REQUEST["getPhoto"];

    $pic = "../posts/" . $id . ".png";
    if(file_exists($pic))
    {
        $data = 1;
    }
    else
    {
        $data = 0;
    }

    echo $data;
}

else if(@$_REQUEST["getCommentsCount"])
{
    $result = $db->getCommentsCount($_REQUEST["getCommentsCount"]);

    echo json_encode(array('result'=>$result));
}

else if(@$_REQUEST["getComments"])
{
    $result = $db->getComments($_REQUEST["getComments"]);

    echo json_encode(array('result'=>$result));
}

else if(@$_REQUEST["getPostNames"])
{

    $getNames = $db->getMultipleIDs($_REQUEST["getPostNames"]);

    $i = array($_REQUEST["i"]);

    $getNames[sizeof($getNames)] = $i;

    echo json_encode(array('result'=>$getNames));
}

else if(@$_REQUEST["getLastTextID"])
{
    $result = $db->getLastTextID($_REQUEST["getLastTextID"]);

    echo json_encode(array('result'=>$result));
}

else if(@$_REQUEST["getLastText"])
{
    $result = $db->getLastText($_REQUEST["getLastText"]);

    echo json_encode(array('result'=>$result));
}

else if(@$_REQUEST["searchTag"])
{
    $_SESSION["tag"] = $_REQUEST["searchTag"];

    echo json_encode(array('result'=>1));
}

else if(@$_REQUEST["resetCode"])
{
    $result = $db->checkCode(strval($_REQUEST["resetCode"]));

    if($result[0])
    {
        include '../html/recover_password.html';
    }
    else
    {
        header('Location: ../Mercury%20Deploy/index.php');
    }
}

/*************************************POST REQUESTS*************************************/

//Register request
if(@$_POST['register'])
{
    $register = $_POST['register'];
    $register['password'] = hash('sha256', $register['password']);
    if(!$db->repeated($register))
    {
        foreach($result as $k)
        {
            $k = addslashes($k);
        }
        $result = $db->add("users", $register);
        if($result[0])
        {
            $_SESSION['id'] = $result[1];
            mkdir("../Users/" . $result[1]);
            copy('https://i.imgur.com/mCHMpLT.png?3', '../Users/' . $result[1] . '/profilePicture.png');
            $_POST = array();
            header('Location: ../php/login_form.php');
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

    $db->add("posts", array("content"=>addslashes($post['content']), "title"=>addslashes($post['title']), "userID"=>$_SESSION["user"]["id"], "timestamp"=>time()));

    $result = $db->getPosts($_SESSION["user"]["id"]);

    echo json_encode(array('result'=>$result));
}

//Delete account request
else if(@$_POST['deleteAccount'])
{
    $db->deleteAll($_SESSION["user"]["id"]);
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

else if(@$_POST['likeID'] && @$_POST['postID'])
{
    if($_POST['delete'])
    {
        $result = $db->deleteMultiple("likes", array("likeID"=>$_POST['likeID'], "postID"=>$_POST['postID']));
    }
    else
    {
        $result = $db->add("likes", array("likeID"=>$_POST['likeID'], "postID"=>$_POST['postID']));
    }
}

else if(@$_POST['form'] && @$_POST['id'])
{
    $result = $db->add("comments", array("postID"=>$_POST['id'], "comment"=>addslashes($_POST['form']), "userID"=>$_SESSION["user"]["id"], "timestamp"=>time()));
}

else if(@$_POST['hashtag'] && @$_POST['id'])
{
    $result = $db->addTags($_POST['hashtag'], $_POST['id']);

    echo json_encode(array('result'=>$result));
}

else if(@$_POST['forgot'])
{
    $result = $db->checkEmail($_POST['forgot']);

    echo($result[0][0]["email"]);

    if($result[0][0]["email"] != "")
    {
        $code = rand() * rand();

        $db->createReset($code, $result[0][0]["email"]);

        $msg = "Someone requested to change the password using this email\nClick the link below if this was you, if not, contact the team at Mercury\nhttp:\\ricardo.webappscc.com/Mercury%20Deploy/php/requests.php?resetCode=" . strval($code);

        $msg = wordwrap($msg,70);

        mail($result[0][0]["email"],"Reset password at Mercury",$msg);

        header('Location: ../index.php');
    }
    else
    {
        header('Location: ../html/forgotten_password.html');
    }
    
}

else if(@$_POST['recover'])
{
    $result = $db->changePassword(hash('sha256', $_POST['recover']["password"]), $_POST['recover']["reset"]);

    echo("Password changed");
    include '../php/login_form.php';
}

?>