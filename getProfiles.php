<?php 

if(!session_id())
{
    @session_start();
}

include_once 'db.php';
$db = new DB;

$names = [];
$getNames = $db->getNames($_SESSION["user"]["id"]);
foreach($getNames as $k => $v)
{
    array_push($names, $v["first_name"] . " " . $v["surname"] . " @" . $v["username"]);
}

$q = $_REQUEST["q"];

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
        /*if(stristr($q, substr($name, 0, strlen($q))))
        {
            if($hint == "")
            {
                $hint = $name;
            }
            else
            {
                $hint .= ", $name";
            }
        }*/
    }
}

echo $hint;

?>
