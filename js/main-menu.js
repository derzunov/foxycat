(function() {
  (function($, window) {
    var $mainMenu, $menuControl, mainMenuClasses;
    mainMenuClasses = {
      mainMenu: 'main-menu',
      mainMenuControl: 'main-menu__control',
      mainMenuClosed: 'main-menu_closed'
    };
    $mainMenu = $('.' + mainMenuClasses.mainMenu);
    $menuControl = $('.' + mainMenuClasses.mainMenuControl);
    return $menuControl.on('click', function() {
      if ($mainMenu.hasClass(mainMenuClasses.mainMenuClosed)) {
        return $mainMenu.removeClass(mainMenuClasses.mainMenuClosed);
      } else {
        return $mainMenu.addClass(mainMenuClasses.mainMenuClosed);
      }
    });
  })(jQuery, window);

}).call(this);
