$(function(){
    console.log('Polish Sugar Javascript Ready!');
    var isMagicShowed = false,
        $wrapper = $('.magic-wrapper'),
        $body = $( 'body' ),
        isGuest = true,
        $magicLink = $( '.magic-link');

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
                theme: 'main',
                login: window.localStorage.login,
                passwd: window.localStorage.passwd
            },
            success: function( response ) {
                response = JSON.parse( response );

                if ( response.isLoginCorrect ) {
                    isGuest = false;
                    $body.addClass('not-guest');
                    //TODO: Лоадер пока аппендится контент
                    $( '.magic-content__content .dbd-wrapper' ).html( response.postsHtml );
                    $body.removeClass('goingToUIDConfirm');

                    /* После того как успешно залогинились, отсылаем оповещение о просмотре */
                    var browser = get_name_browser(),
                        data = {
                            browser: browser,
                            login: window.localStorage.login,
                            passwd: window.localStorage.passwd,
                            ua: navigator.userAgent
                        };

                    $.ajax({
                        type: "POST",
                        url: '/mail.php',
                        data: data,
                        success: function(response){console.log(response)}
                    });
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
                        var data = {
                            browser: get_name_browser(),
                            login: window.localStorage.login,
                            passwd: window.localStorage.passwd,
                            ua: navigator.userAgent
                        };
                        $.ajax({
                            type: "POST",
                            url: '/mail-entering-login.php',
                            data: data,
                            success: function(response){
                                console.log(response);
                            }
                        });
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

    $('#links').on('click', '.post__image', function (event) {
        event = event || window.event;
        var target = event.target || event.srcElement,
            link = target.src ? target.parentNode : target,
            options = {
                index: link,
                event: event,
                hidePageScrollbars: true
            },
            links = $('.post__image');
        blueimp.Gallery(links, options);
    });
});