<?php

if(!session_id())
{
    session_start();
}

$upload = 1;
$targetFile = "./Users/" . $_SESSION['user']['id'] . "/" . "profilePicture.png";
$imageFileType = strtolower(pathinfo($targetFile,PATHINFO_EXTENSION));

if(isset($_POST["submitPic"])) 
{
    $check = getimagesize($_FILES["profilePicture"]["tmp_name"]);
    if($check == false)
    {
        $upload = 0;
    }
}

if($_FILES["profilePicture"]["size"] > 500000)
{
    echo "Picture too large, max 50Mb";
    $upload = 0;
}

if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg" && $imageFileType != "gif")
{
    echo "Sorry, only JPG, JPEG, PNG & GIF files are allowed.";
    $upload = 0;
}

if ($upload != 0) 
{
    if (!move_uploaded_file($_FILES["profilePicture"]["tmp_name"], $targetFile)) 
    {
        echo "Sorry, there was an error uploading your file.";
    }
    else
    {
        include 'profile.html';
    }
}

?>