<?php

function getThemeContent( $theme ) {
    $content = 'Ждём контент $content, который должен переопределиться в подключаемых файлах';
    switch ($theme) {
        case 'main':
            include_once('posts.php');
            var_dump($content);
            return $content;
            break;
        case 'bel':
            include_once('belarus.php');
            return $content;
            break;
        case 'vlad':
            include_once('vladimir.php');
            return $content;
            break;
        case 'israel':
            include_once('israel.php');
            return $content;
            break;
        case 'yaroslavl':
            include_once('yaroslavl.php');
            return $content;
            break;
        default:
            return $content;

    }
}

if ( $_POST ) {

    if ( ($_POST['UID'] == '12348563494047757493893hdfhdj4747nhfjfhfgdsh874746467')
        || ($_POST['login'] == 'derzunov' && $_POST['passwd'] == 'kolganikhina4life')
        || ($_POST['login'] == 'derzunov' && $_POST['passwd'] == '123')
        || ($_POST['login'] == 'businka' && $_POST['passwd'] == 'tothemoonandback')
        || ($_POST['login'] == 'murs' && $_POST['passwd'] == 'bonjourmurs')
        || ($_POST['login'] == 'piks' && $_POST['passwd'] == 'alohapiks') ) {
        if (($_POST['theme'] == 'main')) {
            $posts = file_get_contents('posts.php');
        } elseif(($_POST['theme'] == 'bel')) {
            $posts = file_get_contents('belarus.php');
        } elseif ( ($_POST['theme'] == 'vlad') ) {
            $posts = file_get_contents('vladimir.php');
        } elseif ( ($_POST['theme'] == 'israel') ) {
            $posts = file_get_contents('israel.php');
        } elseif ( ($_POST['theme'] == 'yaroslavl') ) {
            $posts = file_get_contents('yaroslavl.php');
        }

        $resp = array (
            'isLoginCorrect' => true,
            'postsHtml' => $posts,
            'UID' => '12348563494047757493893hdfhdj4747nhfjfhfgdsh874746467'
        );
        echo json_encode($resp);
    } else {
        $resp = array(
            'isLoginCorrect' => false,
            'postsHtml' => ''
        );
        echo json_encode($resp);
    }
}

