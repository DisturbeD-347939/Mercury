<?php

class DB
{

    //Database credentials
    private $host           = '91.103.219.224';
    private $port           = '3306';
    private $db             = 'webapps1_ricardo';
    private $username       = 'webapps1_ricardo';
    private $password       = 'c8ZX34Mv4';
    private $charset        = 'utf8';
    private $dsn;

    //Connect to the database
    function DBConnect()
    {
        $this->dsn = "mysql:host=$this->host;port=$this->port;dbname=$this->db;charset=$this->charset";

        $pdo = new PDO($this->dsn, $this->username, $this->password, [
            PDO::ATTR_ERRMODE               => PDO::ERRMODE_EXCEPTION, //Prevent malfunctioning (throws exceptions when needed)
            PDO::ATTR_DEFAULT_FETCH_MODE    => PDO::FETCH_ASSOC, //Makes the data easier to fetch from the database
        ]);
    
        return $pdo;
    }

    //Disconnect from the database
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

        $sql = "SELECT first_name, surname, username, id FROM users WHERE id != :id";

        $result = $database->prepare($sql);

        $result->execute([
            'id' => $id
        ]);

        $this->DBDisconnect($database);
        return $result->fetchAll();
    }

    //Search a user in the database
    function searchUser($id)
    {
        $database = $this->DBConnect();

        $sql = "SELECT * FROM users WHERE id = :id";

        $result = $database->prepare($sql);

        $result->execute([
            'id' => $id
        ]);

        //$result = $database->prepare("SELECT * FROM users WHERE id = $id");

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

        $sql = "SELECT * FROM posts WHERE userID=:userID";

        $result = $database->prepare($sql);

        $result->execute([
            'userID' => $userID,
        ]);

        $this->DBDisconnect($database);

        if ($result->rowCount()) 
        {
            return [1,$result->fetchAll()];
        }
        else
        {
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
            $sql = "SELECT * FROM users WHERE username=:v OR email=:v";

            $result = $database->prepare($sql);

            $result->execute([
                'v' => strval($v)
            ]);

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
    function login($email, $pass)
    {
        $database = $this->DBConnect();

        $sql = "SELECT * FROM users WHERE email=:email AND password=:pass";

        $result = $database->prepare($sql);

        $result->execute([
            'email' => $email,
            'pass' => $pass
        ]);

        $this->DBDisconnect($database);
        if ($result->rowCount()) 
        {
            return [1,$result->fetch()];
        }
        else
        {
            return [0];
        }
    }

    //Check if a user is following another
    function following($followerID, $userID)
    {
        $database = $this->DBConnect();

        $sql = "SELECT * FROM follows WHERE followerID=:followerID AND userID=:userID";

        $result = $database->prepare($sql);

        $result->execute([
            'followerID' => $followerID,
            'userID' => $userID
        ]);

        $this->DBDisconnect($database);
        return $result->fetch();
    }

    //Check how many followers a user has
    function getFollows($id)
    {
        $database = $this->DBConnect();

        $sql = "SELECT userID FROM follows WHERE followerID=:id";

        $result = $database->prepare($sql);

        $result->execute([
            'id' => $id
        ]);

        $this->DBDisconnect($database);
        return $result->fetchAll();
    }

    //Get multiple posts from users
    function getMultiplePosts($userIDs)
    {
        $userIDs = explode(",", $userIDs);

        $database = $this->DBConnect();

        $in = str_repeat('?,', count($userIDs) - 1) . '?';

        $sql = "SELECT * FROM posts WHERE userID IN ($in)";

        $result = $database->prepare($sql);

        $result->execute($userIDs);

        $this->DBDisconnect($database);
        return [$result->fetchAll()];
    }

    //Get multiple users information based on different ids
    function getMultipleIDs($userIDs)
    {
        $userIDs = explode(",", $userIDs);

        $database = $this->DBConnect();

        $in = str_repeat('?,', count($userIDs) - 1) . '?';

        $sql = "SELECT * FROM users WHERE id IN ($in)";

        $result = $database->prepare($sql);

        $result->execute($userIDs);

        $this->DBDisconnect($database);
        return [$result->fetchAll()];
    }

    //Get likes from a post
    function getLikes($postID)
    {
        $database = $this->DBConnect();

        $sql = "SELECT * FROM likes WHERE postID=:postID";

        $result = $database->prepare($sql);

        $result->execute([
            'postID' => $postID
        ]);

        $this->DBDisconnect($database);
        return [$result->fetchAll()];
    }

    //Get number of comments from a post
    function getCommentsCount($postID)
    {
        $database = $this->DBConnect();

        $sql = "SELECT COUNT(id) FROM comments WHERE postID=:postID";

        $result = $database->prepare($sql);

        $result->execute([
            'postID' => $postID
        ]);

        $this->DBDisconnect($database);
        return [$result->fetchAll()];
    }

    //Get full comments from a post
    function getComments($postID)
    {
        $database = $this->DBConnect();

        $sql = "SELECT * FROM comments WHERE postID=:postID";

        $result = $database->prepare($sql);

        $result->execute([
            'postID' => $postID
        ]);

        $this->DBDisconnect($database);
        return [$result->fetchAll()];
    }

    //Get last post ID
    function getLastTextID($userID)
    {
        $database = $this->DBConnect();

        $sql = "SELECT MAX(id) FROM posts WHERE userID=:userID";

        $result = $database->prepare($sql);

        $result->execute([
            'userID' => $userID
        ]);

        $this->DBDisconnect($database);
        return [$result->fetchAll()];
    }

    //Get everything from a post on certain id
    function getLastText($id)
    {
        $database = $this->DBConnect();

        $sql = "SELECT * FROM posts WHERE id=:id";

        $result = $database->prepare($sql);

        $result->execute([
            'id' => $id
        ]);

        $this->DBDisconnect($database);
        return [$result->fetchAll()];
    }

    //Add tags to the post
    function addTags($tags, $id)
    {
        $database = $this->DBConnect();
    
        $sql = "UPDATE posts SET hashtags=:tags WHERE id=:id";
    
        $result = $database->prepare($sql);
    
        $result->execute([
            'tags' => $tags,
            'id' => $id
        ]);
    
        $this->DBDisconnect($database);
    }

    //Get posts from a user where there are hashtags
    function getTags()
    {
        $database = $this->DBConnect();

        $sql = "SELECT * FROM posts WHERE hashtags IS NOT NULL";

        $result = $database->prepare($sql);

        $result->execute();

        $this->DBDisconnect($database);
        return [$result->fetchAll()];
    }

    //Select the users email
    function checkEmail($email)
    {
        $database = $this->DBConnect();

        $sql = "SELECT email FROM users WHERE email=:email";

        $result = $database->prepare($sql);

        $result->execute([
            'email' => $email
        ]);

        $this->DBDisconnect($database);
        return [$result->fetchAll()];
    }

    //Update the code for password resetting
    function createReset($code, $email)
    {
        $database = $this->DBConnect();

        $sql = "UPDATE users SET reset=:code WHERE email=:email";

        $result = $database->prepare($sql);

        $result->execute([
            'code' => $code, 
            'email' => $email
        ]);

        $this->DBDisconnect($database);
    }

    //Check if the code matches a code in the database
    function checkCode($code)
    {

        $database = $this->DBConnect();

        $sql = "SELECT reset FROM users WHERE reset=:code";

        $result = $database->prepare($sql);

        $result->execute([
            'code' => $code
        ]);

        $this->DBDisconnect($database);
        
        if ($result->rowCount()) 
        {
            return [1,$result->fetchAll()];
        }
        else
        {
            return [0];
        }
    }

    //Change password for a specific user with a specific code
    function changePassword($pass, $code)
    {
        $database = $this->DBConnect();

        $code = str_replace(' ', '', $code);

        $code = strval($code);

        $sql = "UPDATE users SET password=:pass , reset=NULL WHERE reset=:code";

        $result = $database->prepare($sql);

        $result->execute([
            'code' => $code, 
            'pass' => $pass
        ]);

        $this->DBDisconnect($database);
    }

    //Delete from the database
    function deleteAll($id)
    {
        $database = $this->DBConnect();

        $sql = "DELETE FROM users WHERE id=:id";

        $result = $database->prepare($sql);

        $result->execute([
            'id' => $id, 
        ]);


        $sql = "DELETE FROM likes WHERE likeID=:id";

        $result = $database->prepare($sql);

        $result->execute([
            'id' => $id, 
        ]);


        $sql = "SELECT id FROM comments WHERE userID=:id";

        $result = $database->prepare($sql);

        $result->execute([
            'id' => $id, 
        ]);

        $postID = $result->fetchAll();

        foreach($postID as $k => $v)
        {
            $sql = "DELETE FROM comments WHERE id=:id";

            $result = $database->prepare($sql);

            $result->execute([
                'id' => $v["id"], 
            ]);
        }

        $sql = "DELETE FROM comments WHERE userID=:id";

        $result = $database->prepare($sql);

        $result->execute([
            'id' => $id, 
        ]);


        $sql = "DELETE FROM posts WHERE userID=:id";

        $result = $database->prepare($sql);

        $result->execute([
            'id' => $id, 
        ]);


        $sql = "DELETE FROM follows WHERE userID=:id OR followerID=:id";

        $result = $database->prepare($sql);

        $result->execute([
            'id' => $id, 
        ]);


        $this->DBDisconnect($database);
        return $result;
    }

    //INNER JOIN FUNCTION TO GET ALL THE USER INFO AND HIS COMMENTS
    function getUserAndComments($id) 
    {
        $database = $this->DBConnect();

        $sql = "SELECT * FROM posts INNER JOIN users ON :id = 'posts.userID' AND :id = 'users.id'";

        $result = $database->prepare($sql);

        $result->execute([
            'id' => $id, 
        ]);

        $this->DBDisconnect($database);
        return $result;
    }
}

?>