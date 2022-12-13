<?php

if($_POST["listName"] == "NombreDeLaLista"){
    echo "name";
    exit();
}

if( $_POST["listName"] == $_POST["originalName"] || !file_exists("armyFiles/{$_POST["listName"]}.txt") ){
    $myfile = fopen("armyFiles/{$_POST["listName"]}.txt", "w") or die("ERROR 1: No hay permisos para escribir el archivo.");
    fwrite($myfile, $_POST["armyJson"]);
    fclose($myfile);

    echo "done";
}else{
    echo "exists";
}

?>