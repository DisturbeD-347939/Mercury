<?php 

if(!session_id())
{
    @session_start();
}

include_once 'db.php';
$db = new DB;

$q = $_REQUEST;

if($q['search'])
{
    $names = [];
    $getNames = $db->getNames($_SESSION["user"]["id"]);
    foreach($getNames as $k => $v)
    {
        array_push($names, $v["first_name"] . " " . $v["surname"] . " @" . $v["username"]);
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
else if($q['del'])
{
    $q = $_REQUEST['del'];
    
    $result = $db->delete("posts", array("id"=> $q));
}

?>
