<?php
$hostname = "localhost";
$username = "root";
$password = "";

$conn = mysqli_connect($hostname, $username, $password);


if( !$conn && mysqli_connect_error() != "Unknown database 'armydb'"){
    die("Connection failed: ".mysqli_connect_error());
} else {
    $sql = "CREATE DATABASE armyDB;";
    $conn = mysqli_connect($hostname, $username, $password);
    $stmt = mysqli_stmt_init($conn);
    if(!mysqli_stmt_prepare($stmt, $sql))
    {
        echo "La instalación ha fallado.";
        exit();
    }
    mysqli_stmt_execute($stmt);
    mysqli_stmt_close($stmt);
    echo "database creada";
};
$dbname= "armyDB";
$conn = mysqli_connect($hostname, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
$sql = "CREATE TABLE armyUsers (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    userName VARCHAR(255) NOT NULL,
    Password VARCHAR(255) NOT NULL,
    session VARCHAR(255)
)";
if ($conn->query($sql) === TRUE) {
    echo "Table armyUsers created successfully";
} else {
    echo "Error creating table: " . $conn->error;
}
$sql = "CREATE TABLE armies (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    userID VARCHAR(255) NOT NULL,
    armyName VARCHAR(255) NOT NULL,
    armyJSON LONGTEXT
)";
if ($conn->query($sql) === TRUE) {
    echo "Table armies created successfully";
} else {
    echo "Error creating table: " . $conn->error;
}  
  $conn->close();

/**/