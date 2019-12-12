<?php 

if(!session_id())
{
    @session_start();
}

include_once 'db.php';
$db = new DB;

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

else if(@$_POST["title"] && $_POST["content"])
{
    $db->add("posts", array("content"=>$_POST["content"], "title"=>$_POST["title"], "userID"=>$_SESSION["user"]["id"]));

    $result = $db->getPosts($_SESSION["user"]["id"]);

    echo json_encode(array('result' => $result));
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

?>
