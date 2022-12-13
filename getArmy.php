<?php

if(!isset($_POST['listName'])){
    $filesArray = scandir("./armyFiles");
    $filesArray = array_values(array_diff($filesArray, array('..', '.')));
    for($i = 0; $i < count($filesArray); $i++){
        $filesArray[$i] = str_replace(".txt", "", $filesArray[$i]);
    }
    echo json_encode($filesArray);
    exit();
}

echo '["'.$_POST['listName'].'", ';
echo file_get_contents("./armyFiles/{$_POST['listName']}.txt", true);
echo "]";

?>