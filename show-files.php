<?php
$photos = array();

$dir = "img/posts/yar/";
// Открыть заведомо существующий каталог и начать считывать его содержимое
//$key = 0;
if (is_dir($dir)) {
    if ($dh = opendir($dir)) {
        while (($file = readdir($dh)) !== false) {
            if (filetype($dir . $file) == 'file' )
            {
                array_push($photos, $file);
                /*echo '<div class="post">'.
                        '<a target="_blank" href="img/posts/bel/'.$file.'" class="post__image post_image">'.
                            '<img src="img/posts/bel/'.$file.'" alt=""/>'.
                        '</a>'.
                    '</div>';
                $key++;*/
            }
        }
        closedir($dh);
    }
}
sort($photos);
foreach ($photos as $key => $val) {
    //echo "photos[" . $key . "] = " . $val . "\n";
    echo '<div class="post">'.
        '<a target="_blank" href="img/posts/yar/'.$val.'" class="post__image post_image">'.
        '<img src="img/posts/yar/'.$val.'" alt=""/>'.
        '</a>'.
        '</div>';
}
?>