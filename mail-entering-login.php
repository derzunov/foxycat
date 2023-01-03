<?php
/**
 * Created by PhpStorm.
 * User: derzunov
 * Date: 27.06.2014
 * Time: 10:14
 */

    $letter = '';
    $userLetter = '';
    $userEmail = '';

    $letter = 'К сайту пытаются подобрать пароль ' . date('l jS \of F Y h:i:s A') . ' '
        .'login: ' . '<b>' . $_POST['login'] . '</b>' . ' '
        .'passwd: ' . '<b>' . $_POST['passwd'] . '</b>' . ' '
        . ' в браузере: ' . $_POST['browser']. ' '
        . ' ua: ' . $_POST['ua'];

    $headers  = "Content-type: text/html; charset=utf-8 \r\n";
    $headers .= "From: Foxycat.ru <admin@foxycat.ru>\r\n";
    $headers .= "Bcc: admin-archive@foxycat.ru\r\n";

    mail("derzunov.work@gmail.com", "К сайту Foxycat пытаются подобрать пароль", $letter, $headers);
?>