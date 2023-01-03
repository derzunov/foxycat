<?php

include_once('config/conf.php');

$DBH = new PDO("mysql:host=localhost;dbname=foxycat_db", 'root', '');

$sql = "INSERT INTO Post (header, paragraph) VALUES ('Cardinal','Tom B. Erichsen')";
$q = $DBH->prepare($sql);
$q->execute();