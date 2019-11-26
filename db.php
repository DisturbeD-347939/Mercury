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
}

?>