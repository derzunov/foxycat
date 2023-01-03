(function() {
  (function($, window) {
    var $slides, backgroundInterval, iteration, nextIteration, slidesClass, slidesLength;
    slidesClass = "main-background__slide";
    $slides = $('.' + slidesClass);
    iteration = 0;
    nextIteration = 0;
    slidesLength = $slides.length;
    return backgroundInterval = setInterval(function() {
      if (iteration !== slidesLength - 1) {
        nextIteration++;
      } else {
        nextIteration = 0;
      }
      $($slides[iteration]).animate({
        opacity: 0
      }, 2000);
      $($slides[nextIteration]).animate({
        opacity: 1
      }, 2000);
      if (iteration === slidesLength - 1) {
        return iteration = 0;
      } else {
        return iteration++;
      }
    }, 9500);
  })(jQuery, window);

}).call(this);
