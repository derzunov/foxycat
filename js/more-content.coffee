(( $, window ) ->
	mainMenuClasses = {
		moreContent: 'more-content'
		moreContentControl: 'more-content__container'
		moreContentOpened: 'more-content_opened'
	}
	$moreContent = $('.' + mainMenuClasses.moreContent )
	$moreContentControl = $('.' + mainMenuClasses.moreContentControl )

	$moreContentControl.on 'click', () ->
		if $moreContent.hasClass mainMenuClasses.moreContentOpened
			$moreContent.removeClass mainMenuClasses.moreContentOpened
		else
			$moreContent.addClass mainMenuClasses.moreContentOpened
) jQuery, window;