

// Add .osx class to html if on Os/x
if ( navigator.appVersion.indexOf("Mac")!=-1 )
	jQuery('html').addClass('osx');


// When DOM is fully loaded
jQuery(document).ready(function($) {


/* --------------------------------------------------------
	Zoom and link overlays (e.g. for thumbnails)
   --------------------------------------------------------	*/

	(function() {

		$(window).load(function() {

			$('.link').each(function(){
				var $this = $(this);
				var $height = $this.find('img').height();
				var span = $('<span>').addClass('link-overlay').html('&nbsp;').css('top',$height/2).click(function(){
					if (href = $this.find('a:first').attr('href')) {
						top.location.href=href;
					}
				});
				$this.append(span);
			})
			$('.zoom').each(function(){
				var $this = $(this);
				var $height = $this.find('img').height();
				var span = $('<span>').addClass('zoom-overlay').html('&nbsp;').css('top',$height/2);
				$this.append(span);
			})

		});

	})();


/* --------------------------------------------------------
	Back to top button
   --------------------------------------------------------	*/

	(function() {

   			$('<i id="back-to-top" class="icon-chevron-up"></i>').appendTo($('body'));

			$(window).scroll(function() {

				if($(this).scrollTop() != 0) {
					$('#back-to-top').fadeIn();
				} else {
					$('#back-to-top').fadeOut();
				}

			});

			$('#back-to-top').click(function() {
				$('body,html').animate({scrollTop:0},600);
			});

	})();


/* --------------------------------------------------------
	Swipe support for slider
   --------------------------------------------------------	*/

   (function() {

   		var is_touch_device = !!('ontouchstart' in window);

		function swipe( e, direction ) {

			var $carousel = $(e.currentTarget);

			if( direction === 'left' )
				$carousel.find('.carousel-control.right').trigger('click');

			if( direction === 'right' )
				$carousel.find('.carousel-control.left').trigger('click');
		}

		if (is_touch_device === true) {

			$('.carousel').swipe({
				allowPageScroll : 'auto',
				swipeLeft       : swipe,
				swipeRight      : swipe
			});

		}

	})();

/* --------------------------------------------------------
	Keyboard shortcuts
   --------------------------------------------------------	*/

   (function() {

		$('a[rel=shortcut]').each(function(){

			var $this = $(this);
			var key = $this.data('key');
			var href = $this.attr('href');

			if (key && href) {
				$(document).bind('keydown', key, function(){
					top.location.href = href;
				});
			}
		})

	})();

})