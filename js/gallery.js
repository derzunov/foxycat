/**
 * @author tohachan
 * @since 12.09.2012
 *
 * Расширяет jQuery свойствами с названием платформ
 *
 * Например: $.ipad вернет true если скрипт запустить на ipad
 */
(function($, window) {

    var platforms = [
        'linux',
        'mac',
        'win',
        'solaris',
        'unix',
        'ipad',
        'iphone',
        'ipad'
    ];

    for (var i = 0; i < platforms.length; i++) {
        $[platforms[i]] = navigator && navigator.platform && navigator.platform.toLowerCase().indexOf( platforms[i] ) !== -1;
    }

}) (jQuery, window);

/**
 * Функция, которая производит проверку на определенный-браузер/ОС и т.п.
 * Если нужна какая-то новая проверка - дописываем новый case и передаем его имя в check.
 * @since 12.08.12 13:19
 * @author a.gugiev
 *
 * @return boolean Если проверка прошла успешно - true. Если же браузер/ОС у пользователя отличается, или такой проверки нету - false.
 */
function browserIs(check) {
//TODO: добавить определение других браузеров и ОС

    switch (check) {
        case 'ie':
            return navigator.userAgent.indexOf('MSIE') != -1;
        case 'safari':
            return navigator.userAgent.indexOf('Safari') > -1  && navigator.userAgent.indexOf('Chrome') == -1;
        case 'chrome':
            return navigator.userAgent.indexOf('Chrome') != -1;
        case 'firefox':
            return navigator.userAgent.indexOf('Firefox') != -1;
        case 'webkit':
            return navigator.userAgent.indexOf('WebKit') != -1;
        case 'opera':
            return navigator.userAgent.indexOf('Opera') != -1;
        case 'apple-mobile':
            return navigator.userAgent.match(/iPad|iPhone|iPod/i) != null;
        default:
            return false;
    }
}


/**
 * Create jQuery plugin from class
 * @param {function} Class
 */
function createjQueryPlugin(Class, name) {

    var className = Class.toString().match(/^function ([^(]+)/)[1],
        pluginName = className.slice(0,1).toLowerCase() + className.slice(1),
        dataName = name || pluginName,
        $ = jQuery;

    $.fn[pluginName] = function(options) {
        var args;
        args = Array.prototype.slice.call(arguments, 1);

        return this.each(function() {
            var obj;

            obj = $(this).data( dataName );

            if (!(obj instanceof Class)) {
                obj = new Class( $(this), options );
                $(this).data(dataName, obj);
            }

            if ( obj[options] !== undefined ) {
                return obj[options].apply(obj, args);
            }

            return obj;
        });
    }
}

















(function(window, $) {
    /*
     # Класс диалоговой фоторамы
     # @class
     */

    var PhotoViewer;
    PhotoViewer = (function() {

        /*
         # @param {jQuery} $node jQuery объект
         # @constructor
         */
        function PhotoViewer($node, options) {
            var self;
            self = this;
            console.log('работает конструктор');
            this.options = $.extend(true, {
                type: 'image',
                selectors: {
                    link: '.gallery__link',
                    image: '.gallery__preview-image',
                    viewer: '.viewer',
                    viewerInner: '.viewer__inner',
                    viewerOuter: '.viewer__outer',
                    viewerClose: '.viewer__close',
                    viewerImage: '.viewer__image',
                    viewerTitle: '.viewer__title',
                    viewerForward: '.viewer__forward',
                    viewerBackward: '.viewer__backward',
                    viewerBottom: '.viewer__bottom',
                    viewerBottomToggler: '.viewer__bottom-toggler',
                    viewerBottomContent: '.viewer__bottom-content',
                    viewerBottomContentWrapper: '.viewer__bottom-content-wrapper',
                    viewerBottomForward: '.viewer__bottom-forward',
                    viewerBottomBackward: '.viewer__bottom-backward',
                    viewerBottomImageLink: '.viewer__bottom-image-link'
                },
                urls: false // Сюда должен быть передан массив с урлами
            }, options);

            if (!$node && !$node.size()) {
                console.error('incorrect $node in PhotoViewer.constructor');
                return;
            }

            this.$gallery = $node;
            this._createImagesUrls();
            this._preloadImages();
            this._createModal();
            self.currentImage = 0;
            self.bottomMargin = 0;
            self.isModalOpen = false;

            this.$gallery.on('click', self.options.selectors.image, function(event) {
                event.preventDefault();
                if (self.options.type === 'video') {
                    self.showFrame(event);
                } else {
                    self.show(event);
                }
            });

            $(document).on('keyup', function(event) {
                if (event.keyCode === 27) {
                    self.$modal.fadeOut('fast', function() {
                        if (self.options.type === 'video') {
                            self.$container.html('');
                        }
                    });
                }
            });
        }


        PhotoViewer.prototype.slide = function(event) {
            var self = this;

            if (event.target.nodeName.toLowerCase() === 'img') {
                self.currentImage++;
                if (self.currentImage === self.fullImagesUrls.length) {
                    self.currentImage = 0;
                }
                self.appendImage(self.currentImage);
            } else {
                //self.hideModal();
            }
        };

        PhotoViewer.prototype.forward = function(event) {
            var self = this;

            self.currentImage++;
            if (self.currentImage === self.fullImagesUrls.length) {
                self.currentImage = 0;
            }
            self.appendImage( self.currentImage );
        };

        PhotoViewer.prototype.backward = function(event) {
            var self = this;

            self.currentImage--;
            if (self.currentImage < 0) {
                self.currentImage = self.fullImagesUrls.length - 1;
            }
            self.appendImage( self.currentImage );
        };

        PhotoViewer.prototype.setCurrentImage = function(event) {
            var
                src,
                self = this;

            src = $(event.target).closest(self.options.selectors.link).attr('href');

            for (var i = 0; i < self.fullImagesUrls.length; i++) {
                self.currentImage = i;

                if (self.fullImagesUrls[i].link === src) {
                    break;
                }
            }
        };


        PhotoViewer.prototype.show = function(event) {
            var self = this;

            self.setCurrentImage(event);
            self.appendImage(self.currentImage);
            self.showModal();
        };


        PhotoViewer.prototype.showFrame = function(event) {
            var
                src,
                $iframe,
                width,
                height,
                self = this;

            width = 0.9 * $(window).width();
            height = 0.9 * $(window).height();

            src = $(event.target).closest(self.options.selectors.link).attr('href');
            $iframe = $('<iframe/>');
            $iframe.attr({
                'src': src,
                width: width,
                height: height,
                frameborder: 0,
                allowfullscreen: true
            });

            self.$container.html($iframe);
            self.$modal.fadeIn('fast');

            // self.setCurrentImage(event);
            // self.appendImage(self.currentImage);
            // self.showModal();
        };


        PhotoViewer.prototype._createImagesUrls = function() {
            var self = this;
            if (self.options.urls) {
                self.fullImagesUrls = self.options.urls;
            } else {
                self.fullImagesUrls = self.$gallery.data('images');
                if (!self.fullImagesUrls) {
                    self.fullImagesUrls = [];
                    self.$gallery.find(self.options.selectors.link).each(function() {
                        self.fullImagesUrls.push({
                            link: $(this).attr('href')
                        });
                    });
                }
            }
            self.imagesLength = self.fullImagesUrls.length;
        };


        PhotoViewer.prototype._preloadImages = function() {
            var self = this;

            $(window).load(function() {
                $(self.fullImagesUrls).each(function() {
                    $('<img/>')[0].src = this.link;
                });
            });
        };

        PhotoViewer.prototype._createModal = function() {
            console.log('создаю модалку');
            var
                $body,
                $modal,
                modalTemplate,
                self;

            self = this;
            $body = $(document.body);
            modalTemplate = $('#photo-viewer').html();
            $body.append(modalTemplate);

            self.$modal = $(self.options.selectors.viewer, $body);
            self.$container = $(self.options.selectors.viewerInner, self.$modal);

            if (self.options.type === 'video') {
                self.$modal.on('click', function(event) {
                    if (event.target.nodeName.toLowerCase() === 'iframe') {

                    } else {
                        self.$modal.fadeOut('fast', function() {
                            self.$container.html('');
                        });
                    }
                });
            } else {
                /* bind events */
                $( self.options.selectors.viewerImage ).on('click', function(event) {
                    event.stopPropagation();
                    self.forward(event);
                });

                $( self.options.selectors.viewerForward ).on('click', function(event) {
                    event.stopPropagation();
                    self.forward(event);
                });

                $( self.options.selectors.viewerBackward ).on('click', function(event) {
                    event.stopPropagation();
                    self.backward(event);
                });

                $( self.options.selectors.viewerOuter ).on('click', function( event ) {
                    self.hideModal();
                });

                $( self.options.selectors.viewerClose ).on('click', function( event ) {
                    self.hideModal();
                });

                $( self.options.selectors.viewerBottomToggler ).on('click', function( event ) {
                    if ( self.isBottomShowed ) {
                        self.hideBottom();
                    } else {
                        if ( !self.isBottomLoaded ){
                            self.loadBottom();
                        }
                        self.showBottom();
                    }

                });

                $(document).on('keyup', function(event) {

                    /* Открыто ли модальное окно? */
                    if ( self.isModalOpen ) {
                        if (event.keyCode == 37) { /* Клавиша назад */
                            self.backward(event);
                        } else if (event.keyCode == 39) { /* Клавиша вперёд */
                            self.forward(event);
                        }
                    }

                });
            }
        };


        PhotoViewer.prototype.showModal = function() {
            var self= this;
            self.isModalOpen = true;
            self.$modal.fadeIn('fast');
        };

        PhotoViewer.prototype.hideModal = function() {
            var self = this;
            self.isModalOpen = false;
            self.$modal.fadeOut('fast');
        };

        PhotoViewer.prototype.loadBottom = function() {
            var self = this,
                $viewer = $('.viewer'),
                html = '';
            $.each(self.fullImagesUrls, function(){
                var $preview = $('<div class="viewer__bottom-image" ></div>'),
                    $linkPreview = $('<a class="viewer__bottom-image-link" href="'+ this.link +'" />');
                $preview.appendTo( $linkPreview );
                $( self.options.selectors.viewerBottomContent).append($linkPreview);
                $preview.css({
                    backgroundImage: 'url('+ this.link +')'
                });
            });



            $viewer.on('click', self.options.selectors.viewerBottomImageLink, function( event ) {
                event.preventDefault();
                event.stopPropagation();
                self.setCurrentImage( event );
                self.appendImage( self.currentImage );
            });

            $viewer.on('click', self.options.selectors.viewerBottomForward, function( event ) {
                event.preventDefault();
                event.stopPropagation();
                self.bottomForward();
            });

            $viewer.on('click', self.options.selectors.viewerBottomBackward, function( event ) {
                event.preventDefault();
                event.stopPropagation();
                self.bottomBackward();
            });



            self.isBottomLoaded = true;
        };

        PhotoViewer.prototype.bottomForward = function() {
            var self = this,
                imgsInViewPortCount = Math.round( $( self.options.selectors.viewerBottomContentWrapper ).width()/180 );
            if ( self.bottomMargin < self.imagesLength * 180 - imgsInViewPortCount * 180 ) {
                self.bottomMargin += 180;
            }
            $( self.options.selectors.viewerBottomContent ).css({
                marginLeft: - self.bottomMargin
            });

        };

        PhotoViewer.prototype.bottomBackward = function() {
            var self = this;
            if (self.bottomMargin >= 180) {
                self.bottomMargin -= 180;
            }
            $( self.options.selectors.viewerBottomContent ).css({
                marginLeft: - self.bottomMargin
            });
        };

        PhotoViewer.prototype.showBottom = function() {
            var self = this;
            self.isBottomShowed = true;
            $( self.options.selectors.viewer ).addClass('viewer_bottom-open');
        };

        PhotoViewer.prototype.hideBottom = function() {
            var self = this;
            self.isBottomShowed = false;
            $( self.options.selectors.viewer ).removeClass('viewer_bottom-open');
        };

        PhotoViewer.prototype.appendImage = function(imageNumber) {
            var
                title,
                $currentImage,
                self;

            self = this;
            $currentImage = $(self.options.selectors.viewerImage, self.$container)
                .attr('src', self.fullImagesUrls[imageNumber].link);

            title = self.fullImagesUrls[imageNumber].title;
            if (title) {
                $currentTitle = $(self.options.selectors.viewerTitle, self.$container)
                    .text(title.text);
            } else {
                $currentTitle = $(self.options.selectors.viewerTitle, self.$container).hide();
            }
        };

        return PhotoViewer;

    }) ();

    createjQueryPlugin(PhotoViewer);

})(window, jQuery);


/*********************************************************************************/
/* вызов */
/*********************************************************************************/
jQuery(document).ready(function( $ ) {

    $('body').photoViewer({
        selectors: {
            link: '.post__image',
            image: 'img'
        }
    });
    /*$('.js-video-gallery').photoViewer({
        type: 'video',
        selectors: {
            link: 'a',
            image: 'img'
        }
    });*/
});
