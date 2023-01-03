<?php

$dir = "img/posts/israel-renaming/";
// Открыть заведомо существующий каталог и начать считывать его содержимое
//$key = 0;
if (is_dir($dir)) {
    if ($dh = opendir($dir)) {
        $iteration = 0;
        while (($file = readdir($dh)) !== false) {
            if (filetype($dir . $file) == 'file' )
            {
                rename($dir . $file, $dir . 'image_' . $iteration . '.jpg');
                $iteration++;
            }
        }
        closedir($dh);
    }
}
/*
sort($photos);
foreach ($photos as $key => $val) {
    //echo "photos[" . $key . "] = " . $val . "\n";
    echo '<div class="post">'.
        '<a target="_blank" href="img/posts/bel/'.$val.'" class="post__image post_image">'.
        '<img src="img/posts/bel/'.$val.'" alt=""/>'.
        '</a>'.
        '</div>';
} */
?>