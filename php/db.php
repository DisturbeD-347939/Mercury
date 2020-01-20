<?php

class DB
{

    private $host           = '127.0.0.1';
    private $port           = '3306';
    private $db             = 'social_media';
    private $username       = 'root';
    private $password       =  null;
    private $charset        = 'utf8mb4';
    private $dsn;

    function DBConnect()
    {
        $this->dsn = "mysql:host=$this->host;port=$this->port;dbname=$this->db;charset=$this->charset";

        $pdo = new PDO($this->dsn, $this->username, $this->password, [
            PDO::ATTR_ERRMODE               => PDO::ERRMODE_EXCEPTION, //Prevent malfunctioning (throws exceptions when needed)
            PDO::ATTR_DEFAULT_FETCH_MODE    => PDO::FETCH_ASSOC, //Makes the data easier to fetch from the database
        ]);
    
        return $pdo;
    }

    function DBDisconnect($database)
    {
        $database = null;
    }

    //Add to the database
    function add($table, $attributes)
    {
        $database = $this->DBConnect();
        
        $tempKeys = implode(",", array_keys($attributes));
        $tempValues = implode("','", array_values($attributes));

        $result = $database->query("INSERT INTO $table ($tempKeys) VALUES ('$tempValues')");
        //var_dump("INSERT INTO $table ($tempKeys) VALUES ('$tempValues')");

        $id = $database->lastInsertId();

        $this->DBDisconnect($database);
        return [$result, $id];
    }

    //Get identification from a user
    function searchNames($id)
    {
        $database = $this->DBConnect();

        $result = $database->query("SELECT first_name, surname, username, id FROM users WHERE id != $id");

        $this->DBDisconnect($database);
        return $result->fetchAll();
    }

    //Search a user in the database
    function searchUser($id)
    {
        $database = $this->DBConnect();

        $result = $database->query("SELECT * FROM users WHERE id = $id");

        $this->DBDisconnect($database);
        return $result->fetch();
    }

    //Delete from the database
    function delete($table, $attributes)
    {
        $database = $this->DBConnect();

        $tempKeys = array_keys($attributes)[0];
        $tempValues = array_values($attributes)[0];

        $result = $database->query("DELETE FROM $table WHERE $tempKeys = '$tempValues'");

        $this->DBDisconnect($database);
        return $result;
    }

    //Delete from the database
    function deleteMultiple($table, $attributes) //MAXIMUM 2 attributes
    {
        $database = $this->DBConnect();

        $tempKeys = array_keys($attributes);
        $tempValues = array_values($attributes);

        $result = $database->query("DELETE FROM $table WHERE $tempKeys[0]=$tempValues[0] AND $tempKeys[1]=$tempValues[1]");

        $this->DBDisconnect($database);
        return $result;
    }

    //Get posts from a user
    function getPosts($userID)
    {
        $database = $this->DBConnect();

        $result = $database->query("SELECT * FROM posts WHERE userID='$userID'");

        if ($result->rowCount()) 
        {
            $this->DBDisconnect($database);
            return [1,$result->fetchAll()];
        }
        else
        {
            $this->DBDisconnect($database);
            return [0];
        }
    }

    //Check if the user already exists in the database
    function repeated($data)
    {
        $database = $this->DBConnect();

        $found = [];
        foreach($data as $k => $v)
        {
            $result = $database->query("SELECT * FROM users WHERE $k='$v'");
            if ($result->rowCount()) 
            {
                if($k == "username" || $k == "email")
                {
                    array_push($found, $k);
                }
            }
        }

        $this->DBDisconnect($database);
        return $found;
    }

    //Login into the website 
    function login($email, $password)
    {
        $database = $this->DBConnect();

        $result = $database->query("SELECT * FROM users WHERE email='$email' AND PASSWORD='$password'");

        if ($result->rowCount()) 
        {
            $this->DBDisconnect($database);
            return [1,$result->fetch()];
        }
        else
        {
            $this->DBDisconnect($database);
            return [0];
        }
    }

    //Check if a user is following another
    function following($followerID, $userID)
    {
        $database = $this->DBConnect();

        $result = $database->query("SELECT * FROM follows WHERE followerID='$followerID' AND userID='$userID'");

        $this->DBDisconnect($database);
        return $result->fetch();
    }

    //Check how many followers a user has
    function getFollows($id)
    {
        $database = $this->DBConnect();

        $result = $database->query("SELECT userID FROM follows WHERE followerID='$id'");

        $this->DBDisconnect($database);
        return $result->fetchAll();
    }

    //Get multiple posts from users
    function getMultiplePosts($userIDs)
    {
        $database = $this->DBConnect();

        $result = $database->query("SELECT * FROM posts WHERE userID IN ($userIDs)");

        $this->DBDisconnect($database);
        return [$result->fetchAll()];
    }

    function getMultipleIDs($userIDs)
    {
        $database = $this->DBConnect();

        $result = $database->query("SELECT * FROM users WHERE id IN ($userIDs)");

        $this->DBDisconnect($database);
        return [$result->fetchAll()];
    }

    function getLikes($postID)
    {
        $database = $this->DBConnect();

        $result = $database->query("SELECT * FROM likes WHERE postID='$postID'");

        $this->DBDisconnect($database);
        return [$result->fetchAll()];
    }

    function getCommentsCount($postID)
    {
        $database = $this->DBConnect();

        $result = $database->query("SELECT COUNT(id) FROM comments WHERE postID='$postID'");

        $this->DBDisconnect($database);
        return [$result->fetchAll()];
    }

    function getComments($postID)
    {
        $database = $this->DBConnect();

        $result = $database->query("SELECT * FROM comments WHERE postID='$postID'");

        $this->DBDisconnect($database);
        return [$result->fetchAll()];
    }

}

?>