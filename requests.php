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

    echo $hint;
}

else if(@$_REQUEST["del"])
{
    $q = $_REQUEST['del'];
    
    $result = $db->delete("posts", array("id"=> $q));
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
    var_dump($result);
    $_SESSION["searchProfile"] = $result;
}

else if(@$_REQUEST["follow"])
{
    $result = $db->add("follows", array("followerID"=>$_REQUEST["follow"], "userID"=>$_SESSION["user"]["id"]));
}

else if(@$_REQUEST["unfollow"])
{
    $result = $db->delete("follows", array("followerID"=>$_REQUEST["unfollow"], "userID"=>$_SESSION["user"]["id"]));
}

else if(@$_REQUEST["following"])
{
    $result = $db->following($_REQUEST["following"][0], $_REQUEST["following"][1]);

    echo json_encode(array('result' => $result));
}

?>
