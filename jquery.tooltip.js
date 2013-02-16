





(function( $ ) {
	
	var $this = $(this);

	var $tooltip_timeout;

	var methods = {

		init : function() {
			var $body = $('body');
			$body.append('<div id="tooltip-hover" data-caller=""><div id="tooltip-hover-pointer"></div><span id="tooltip-text"></span></div>');

			var $tooltip      = $('#tooltip-hover');
			var $tooltip_text = $('#tooltip-text');

			$.each($('*[data-tooltip]'), function() {

				var $this = $(this);

				var ts = Math.round((new Date()).getTime() / 1000);
					ts += Math.ceil(Math.random()*1000);

				$this.attr('data-tooltipid',ts);

				$this.unbind('mouseover');
				$this.unbind('mouseout');


				/* ******************************************
				*
				* mouseover
				*
				****** */
				$(this).mouseover(function() {

					$this.mOver = window.setTimeout(function() {
						if ( $tooltip.is(':visible') && $this.attr('data-tooltipid') == $tooltip.attr('data-caller') ) {
							window.clearTimeout($tooltip_timeout);

						} else if ( $tooltip.is(':hidden') || ($this.attr('data-tooltipid') != $tooltip.attr('data-caller')) ) {
							window.clearTimeout($tooltip_timeout);

							// get the necessary dimensions to place
							// the tooltip where we need it
							var $offset = $this.offset();
							var $left   = parseInt($offset.left);
							var $top    = parseInt($offset.top);
							var $width  = parseInt($this.outerWidth());
							var $height = parseInt($this.outerHeight());

							var $bottom = $top+$height;

							$tooltip_left = $left+($width/2);
							$tooltip_top  = $bottom;

							// set the tooltip css
							// set the display to block and visibility to hidden
							// this allows us to get the actual width of the tooltip text
							$tooltip.css({
								'left'       : $tooltip_left + 'px',
								'top'        : $tooltip_top + 'px',
								'display'    : 'block',
								'visibility' : 'hidden'
							});

							// clear the previous text
							$tooltip_text.text('');

							// get the new text
							var $text = $this.attr('data-tooltip');

							// set the new text
							$tooltip_text.text($text);

							var $width = parseInt($tooltip.outerWidth())/2;

							// set the display to none and visibility to visible
							// this will allow for the fadeIn
							$tooltip.css({
								'display'     : 'none',
								'visibility'  : 'visible',
								'margin-left' : '-' + $width + 'px'
							});

							$tooltip.attr('data-caller',$this.attr('data-tooltipid'));
							// display the tooltip
							$tooltip.fadeIn(150);
						}
					}, 250);

				});
				/* ******
				*
				* End: mouseover
				*
				****************************************** */


				/* ******************************************
				*
				* mouseout
				*
				****** */
				$(this).mouseout(function() {
					$tooltip_timeout = window.setTimeout(function() {
						$tooltip.fadeOut(150);
					}, 250);
					window.clearTimeout($this.mOver);
				});

			});

			$tooltip.mouseover(function(){
				window.clearTimeout($tooltip_timeout);
			});

			$tooltip.mouseout(function() {
				$tooltip_timeout = window.setTimeout(function() {
					$tooltip.fadeOut(150);
				}, 250);
			});
		},

		fadeOut : function(obj) {
			var $tooltip = $('#tooltip-hover');
			$tooltip.fadeOut(150);
		},

		destroy : function(obj) {
			var $tooltip = $('#tooltip-hover');
			$tooltip.fadeOut(150);
			if ( typeof(obj) == 'object' ) {
				if ( obj.length > 1 ) {
					$.each(obj,function() {
						obj.unbind('mouseover');
						obj.unbind('mouseout');
					})
				}
			} else {
				$.each($('*[data-tooltip]'), function() {
					$(this).unbind('mouseover');
					$(this).unbind('mouseout');
				});
			}
		},


		chained : function(_text) {
			methods.init();
			var $this = $(this);
			var $tooltip      = $('#tooltip-hover');
			var $tooltip_text = $('#tooltip-text');
			var $text         = _text;


			// get the necessary dimensions to place
			// the tooltip where we need it
			var $offset = $this.offset();
			var $left   = parseInt($offset.left);
			var $top    = parseInt($offset.top);
			var $width  = parseInt($this.outerWidth());
			var $height = parseInt($this.outerHeight());

			var $bottom = $top+$height;

			$tooltip_left = $left+($width/2);
			$tooltip_top  = $bottom;

			// set the tooltip css
			// set the display to block and visibility to hidden
			// this allows us to get the actual width of the tooltip text
			$tooltip.css({
				'left'       : $tooltip_left + 'px',
				'top'        : $tooltip_top + 'px',
				'display'    : 'block',
				'visibility' : 'hidden'
			});

			// clear the previous text
			$tooltip_text.text('');

			// set the new text
			$tooltip_text.text($text);

			var $width = parseInt($tooltip.outerWidth())/2;

			// set the display to none and visibility to visible
			// this will allow for the fadeIn
			$tooltip.css({
				'display'     : 'none',
				'visibility'  : 'visible',
				'margin-left' : '-' + $width + 'px'
			});

			$tooltip.attr('data-caller',$this.attr('data-tooltipid'));
			// display the tooltip
			$tooltip.fadeIn(150);

		}

	};


	$.fn.tooltip = function( method ) {
		// Method calling logic
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.chained.apply( this, arguments );
		} else {
			return methods.chained.apply( this, arguments  );
		}

		return this;

	};


	$.tooltip = function( method ) {

		// Method calling logic
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			return methods.init.apply(  this, arguments  );
		}

		return this;

	};

})( jQuery );