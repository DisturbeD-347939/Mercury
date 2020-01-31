<?php

if(!session_id())
{
    @session_start();
}

//Variables for image storing
$upload = 1;
$targetFile = "../Users/" . $_SESSION['user']['id'] . "/" . "profilePicture.png";
$imageFileType = strtolower(pathinfo($targetFile,PATHINFO_EXTENSION));

//If we get a POST request
if(isset($_POST["submitPic"])) 
{
    $check = getimagesize($_FILES["profilePicture"]["tmp_name"]);
    if($check == false)
    {
        $upload = 0;
    }
}

//Check if image is small enough
if($_FILES["profilePicture"]["size"] > 500000)
{
    $upload = 0;
}

//Check if image is the right extension
if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg" && $imageFileType != "gif")
{
    $upload = 0;
}

if ($upload != 0) 
{
    if (!move_uploaded_file($_FILES["profilePicture"]["tmp_name"], $targetFile)) 
    {
        header('Location: ../php/profile.php');
    }
    else
    {
        //Success uploading file
        header('Location: ../php/profile.php');
    }
}
else
{
    header('Location: ../php/profile.php');
}

?>