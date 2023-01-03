$(function(){
    console.log('Polish Sugar Javascript Ready!');
    var $p1 = $('.poetry .poetry__paragraph-item_1'),
        $p2 = $('.poetry .poetry__paragraph-item_2'),
        $p3 = $('.poetry .poetry__paragraph-item_3'),
        $p4 = $('.poetry .poetry__paragraph-item_4'),
        isMagicShowed = false,
        $wrapper = $('.magic-wrapper'),
        $body = $( 'body' ),
        isGuest = true,
        p1 = [
            'Заметался пожар голубой,',
            'Был я весь - как запущенный сад,',
            'Мне бы только смотреть на тебя,',
            'Поступь нежная, легкий стан,',
            'Я б навеки забыл кабаки',
            'Я б навеки пошел за тобой'
        ],
        p2 = [
            'Позабылись родимые дали.',
            'Был на женщин и зелие падкий.',
            'Видеть глаз злато-карий омут,',
            'Если б знала ты сердцем упорным,',
            'И стихи бы писать забросил.',
            'Хоть в свои, хоть в чужие дали...'
        ],
        p3 = [
            'В первый раз я запел про любовь,',
            'Разонравилось пить и плясать',
            'И чтоб, прошлое не любя,',
            'Как умеет любить хулиган,',
            'Только б тонко касаться руки',
            'В первый раз я запел про любовь,'
        ],
        p4 = [
            'В первый раз отрекаюсь скандалить.',
            'И терять свою жизнь без оглядки.',
            'Ты уйти не смогла к другому.',
            'Как умеет он быть покорным.',
            'И волос твоих цветом в осень.',
            'В первый раз отрекаюсь скандалить.'
        ],
        options = {
            duration: 4777,          // Time (ms) each blurb will remain on screen
            rearrangeDuration: 200, // Time (ms) a character takes to reach its position
            effect: 'random',        // Animation effect the characters use to appear
            centered: true,           // Centers the text relative to its container
            loop: false
        },
        $magicLink = $( '.magic-link');
    /*$p1.textualizer(p1, options); // textualize it!
     $p1.textualizer('start'); // start

     $p2.textualizer(p2, options); // textualize it!
     $p2.textualizer('start'); // start

     $p3.textualizer(p3, options); // textualize it!
     $p3.textualizer('start'); // start

     $p4.textualizer(p4, options); // textualize it!
     $p4.textualizer('start'); // start

     $(window).on('resize', function() {
     if (!isMagicShowed) {
     console.log('Перезапускаю текстуалайзер');
     $p1.textualizer('destroy');
     $p1.textualizer(p1, options); // textualize it!
     $p1.textualizer('start'); // start

     $p2.textualizer('destroy');
     $p2.textualizer(p2, options); // textualize it!
     $p2.textualizer('start'); // start

     $p3.textualizer('destroy');
     $p3.textualizer(p3, options); // textualize it!
     $p3.textualizer('start'); // start

     $p4.textualizer('destroy');
     $p4.textualizer(p4, options); // textualize it!
     $p4.textualizer('start'); // start
     }
     });*/

    function routeFeed() {
        $wrapper.addClass('show');
        $body.addClass('show-feed');
        $magicLink.attr('href', '#/main')
    }

    var iteration = 0;

    function loginByUID( UID ) {
        $body.addClass('goingToUIDConfirm');
        $.ajax({
            type: "POST",
            url: '/feed.php',
            data: {
                UID: window.localStorage.UID,
                theme: 'main'
            },
            success: function( response ) {
                response = JSON.parse( response );

                if ( response.isLoginCorrect ) {
                    isGuest = false;
                    $body.addClass('not-guest');
                    //TODO: Лоадер пока аппендится контент
                    $( '.magic-content__content .dbd-wrapper' ).html( response.postsHtml );
                    setTimeout(function(){
                        //window.location.hash = '#/feed';
                    }, 1000);
                    $body.removeClass('goingToUIDConfirm');
                } else {
                    window.localStorage.UID = false;
                    $body.removeClass('goingToUIDConfirm');
                }
            }
        });
    }

    if ( window.localStorage && window.localStorage.UID ) {
        loginByUID( window.localStorage.UID );

    } else {
        $body.removeClass('goingToUIDConfirm');
        console.log(1111111);
    }

    function login( login, passwd ) {

        $.ajax({
            type: "POST",
            url: '/feed.php',
            data: {
                login: login,
                passwd: passwd,
                theme: 'main'
            },
            success: function( response ) {
                response = JSON.parse( response );

                if ( response.isLoginCorrect ) {
                    isGuest = false;
                    $body.addClass('not-guest');
                    //TODO: Лоадер пока аппендится контент
                    $( '.magic-content__content .dbd-wrapper' ).html( response.postsHtml );
                    setTimeout(function(){
                        window.location.hash = '#/feed';
                    }, 1000);
                    window.localStorage.login = login;
                    window.localStorage.passwd = passwd;
                    window.localStorage.UID = response.UID;
                } else {
                    alert('Неверный логин или пароль!');
                    iteration++;
                    if ( iteration > 5 ) {
                        alert('Похоже, пароль Вами забыт, или Вы - задничка?..');
                        iteration = 0;
                    }
                    window.localStorage.UID = false;
                }

            }
        });
    }

    $( '#submit' ).on( 'click', function() {
        login( $('#login').val(), $('#passwd').val() );
    });

    //TODO: Наприсать ф-ю gotoLink(), чтобы не писать фигню как эта - window.location.hash = '#/feed';

    function routeMain() {
        $wrapper.removeClass('show');
        $body.removeClass('show-feed');
        //isMagicShowed = false;
        $magicLink.attr('href', '#/feed')
    }

    function toggleFeed() {
        var $wrapper = $('.magic-wrapper');
        if ($wrapper.hasClass('show')){
            $wrapper.removeClass('show');
            isMagicShowed = false;
        } else {
            $wrapper.addClass('show');
            isMagicShowed = true;
        }
    }

    Path.map("#/feed").to(function() {
        //Если есть в сторадже логин и пароль
        //Если я известен
        if( !isGuest ){
            routeFeed();
        } else {
            window.location.hash = '#/main';            //Вводи логин и пароль, сЦука =)
        }
        //Если нет

    });

    Path.map("#/main").to(function(){
        routeMain()
    });

    /*Примеры роутера*/

    function clearPanel(){
        // You can put some code in here to do fancy DOM transitions, such as fade-out or slide-in.
    }

    Path.map("#/comments").to(function(){
        alert("Comments!");
    }).enter(clearPanel);

    Path.map("#/posts").to(function(){
        alert("Posts!");
    }).enter(clearPanel);

    Path.root("#/main");

    Path.listen();

    function get_name_browser(){
        // получаем данные userAgent
        var agent = navigator.userAgent;
        // с помощью регулярок проверяем наличие текста,
        // соответствующие тому или иному браузеру
        if (agent.search(/Chrome/) > 0) return 'Google Chrome';
        if (agent.search(/Firefox/) > 0) return 'Firefox';
        if (agent.search(/Opera/) > 0) return 'Opera';
        if (agent.search(/Safari/) > 0) return 'Safari';
        if (agent.search(/MSIE/) > 0) return 'Internet Explorer';
        if (agent.search(/NET4/) > 0) return 'Internet Explorer New';
        // условий может быть и больше.
        // сейчас сделаны проверки только
        // для популярных браузеров
        return 'Не определен';
    }

    var browser = get_name_browser(),
        data = {
            browser: browser
        };

    $.ajax({
        type: "POST",
        url: '/mail.php',
        data: data,
        success: function(response){console.log(response)}
    });
});