<?php
/**
 * Created by PhpStorm.
 * User: Дмитрий
 * Date: 29.09.14
 * Time: 0:23
 */ ?>

<html>
<head>
    <title>Результат загрузки файла</title>
</head>
<body>
<?php
if($_FILES["filename"]["size"] > 1024*3*1024)
{
    echo ("Размер файла превышает три мегабайта");
    exit;
}
// Проверяем загружен ли файл
if($_POST['password']=='123' && is_uploaded_file($_FILES["filename"]["tmp_name"]))
{
    // Если файл загружен успешно, перемещаем его
    // из временной директории в конечную
    move_uploaded_file($_FILES["filename"]["tmp_name"], "img/uploaded/".$_FILES["filename"]["name"]);
    include_once('/dbconnect.php');

    echo "Успех!";
    echo " Пусть: img/uploaded/".$_FILES["filename"]["name"];
    echo "<br/>";
    echo "<img src=". "img\\uploaded\\".$_FILES["filename"]["name"] ." />";
} else {
    echo("Ошибка загрузки файла");
}
?>
</body>
</html>