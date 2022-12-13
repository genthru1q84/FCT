<!DOCTYPE html>
<html lang='en'>

<head>
    <meta charset='UTF-8'>
    <meta http-equiv='X-UA-Compatible' content='IE=edge'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Creador de listas</title>
    <link rel='stylesheet' href='estilos.css'>
    <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css'>
</head>

<body>
<div id='logo'>
    <img src='Logo.png'>
    <h1 id='name'>Para Bellum - List Repository</h1>
    <a href="index.html" id='nav'> Go to Builder </a>
</div>

<?php

$filesArray = scandir("./formattedFiles");
$filesArray = array_values(array_diff($filesArray, array('..', '.')));

for($i = 0; $i < count($filesArray); $i++){

$name = str_replace(".txt", "", $filesArray[$i]);
$list = file_get_contents("./formattedFiles/{$name}.txt", true);;

?>
    <div class="unitPanel">
        <h3> <?php echo $name; ?> </h3>
        <p> <?php echo $list; ?> </p>
    </div>

<?php

}

?>

</body>
