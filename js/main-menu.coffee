(( $, window ) ->
    mainMenuClasses = {
        mainMenu: 'main-menu'
        mainMenuControl: 'main-menu__control'
        mainMenuClosed: 'main-menu_closed'
    }
    $mainMenu = $('.' + mainMenuClasses.mainMenu )
    $menuControl = $('.' + mainMenuClasses.mainMenuControl )

    $menuControl.on 'click', () ->
        if $mainMenu.hasClass mainMenuClasses.mainMenuClosed
            $mainMenu.removeClass mainMenuClasses.mainMenuClosed
        else
            $mainMenu.addClass mainMenuClasses.mainMenuClosed
) jQuery, window;