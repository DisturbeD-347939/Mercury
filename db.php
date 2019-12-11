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

    function getNames($id)
    {
        $database = $this->DBConnect();

        $result = $database->query("SELECT first_name, surname, username, id FROM users WHERE id != $id");

        $this->DBDisconnect($database);
        return $result->fetchAll();
    }

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
        //var_dump("DELETE FROM $table WHERE $tempKeys = '$tempValues'");

        $this->DBDisconnect($database);
        return $result;
    }

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
}

?>