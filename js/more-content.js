(function() {
  (function($, window) {
    var $moreContent, $moreContentControl, mainMenuClasses;
    mainMenuClasses = {
      moreContent: 'more-content',
      moreContentControl: 'more-content__container',
      moreContentOpened: 'more-content_opened'
    };
    $moreContent = $('.' + mainMenuClasses.moreContent);
    $moreContentControl = $('.' + mainMenuClasses.moreContentControl);
    return $moreContentControl.on('click', function() {
      if ($moreContent.hasClass(mainMenuClasses.moreContentOpened)) {
        return $moreContent.removeClass(mainMenuClasses.moreContentOpened);
      } else {
        return $moreContent.addClass(mainMenuClasses.moreContentOpened);
      }
    });
  })(jQuery, window);

}).call(this);
