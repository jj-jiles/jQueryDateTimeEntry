
(function( $ ) {
	
	var $this = $(this);

	var options  = {};
	var defaults = {
		hasCallback         : false,
		callback            : undefined,
		displayText         : 'Enter a Date and Time',
		id                  : 'dateTimeEntry',
		PlaceHolder         : '',
		PlaceHolderClass    : 'dateTimeEntryPlaceHolder',
		PopUpClass          : '.select-options-menu'
	};

	var DateTime = {};

	var methods = {

		init : function(objOptions) {

			// options passed is an object
			// get the properties of the object for a custom $.alert modal
			if ( typeof(objOptions) == 'object' ) {
				for ( var property in objOptions ) {
					defaults[property]   = objOptions[property];
				}
			}

			if ( typeof defaults.callback == 'function' ) {
				defaults.hasCallback = true;
			}
			options = defaults;
		},



		createDateTimePlaceholder : function(ojbOptions) {
			methods.init();

			html = '<em class="' + options.PlaceHolderClass + '"></em>';
			options.Parent.append(html);

		},


		popupLayout : function() {

			methods.init();
			html = '<div class="jqDateTimeEntry select-options-menu"><div class="pointer"></div>';
			html += '<p class="jqDTETop"><span>' + options.displayText + '</span><span class="nowDate">Now()</span></p>';
			html += '<p>';
			html += '<input type="text" id="dateTimeEntryMonth" name="dateTimeEntryMonth" class="one dateformat-input month" value="MM" maxlength="2" />&nbsp;';
			html += '/&nbsp;&nbsp;<input type="text" id="dateTimeEntryDay" name="dateTimeEntryMonth" class="one dateformat-input day" value="DD" maxlength="2" />&nbsp;';
			html += '/&nbsp;&nbsp;<input type="text" id="dateTimeEntryYear" name="dateTimeEntryMonth" class="four dateformat-input year" value="YYYY" maxlength="4" />&nbsp;';
			html += '&nbsp;&nbsp;<input type="text" id="dateTimeEntryHours" name="dateTimeEntryHours" class="one dateformat-input hours" value="HH" maxlength="2" />&nbsp;';
			html += ':&nbsp;&nbsp;<input type="text" id="dateTimeEntryMinutes" name="dateTimeEntryMinutes" class="one dateformat-input minutes" value="MM" maxlength="2" />&nbsp;';
			html += ':&nbsp;&nbsp;<input type="text" id="dateTimeEntrySeconds" name="dateTimeEntrySeconds" class="one dateformat-input seconds" value="SS" maxlength="2" />';
			html += '</p></div>';
			return html;
		},


		createDateTimeEntry : function(objOptions) {
			methods.init(objOptions);

			this.unbind('click').on('click', function() {
				options.Parent = $(this);
				if ( options.Parent.find(options.PopUpClass).length == 0) {
					if ( options.Parent.find(options.PlaceHolder).length == 0 ) {
						methods.createDateTimePlaceholder();
					}
					options.domPlaceHolder = options.Parent.find(options.PlaceHolder);
					methods.onClick(objOptions);
				}
			});
		},


		showDateTimeEntry : function() {
			if ( options.dateTimeEntryDisplay.is(':hidden') ) {
				options.dateTimeEntryDisplay.show().find('.month').select();
			}
		},


		hideDateTimeEntry : function() {
			if (  options.dateTimeEntryDisplay.length > 0 && options.dateTimeEntryDisplay.is(':visible') ) {
				options.dateTimeEntryDisplay.hide();
				options.Parent.removeClass('selected');
				options.Parent.find(options.PopUpClass).remove();
				
				window.clearTimeout(methods.KeyDownTimeOut);
				window.clearTimeout(methods.KeyUpTimeOut);
				
				if ( options.hasCallback && options.DateTime != options.OriginalDateTime ) {
					options.callback(options);
				}
			}
		},


		makeIntDouble : function(n){
			return (String(n).length == 1 && n <= 9) ? "0" + n : "" + n;
		},



		updateDateTime : function(objOptions) {
			methods.init(objOptions);
			isnan=false;
			for (var prop in DateTime) {
				if ( isNaN(DateTime[prop]) || DateTime[prop].length == 0 || DateTime[prop] == 0) {
					isnan = true;
					break;
				}
			}
			if (!isnan ) {
				options.DateTime = DateTime.Month + '/' + DateTime.Day + '/' + DateTime.Year + ' ' + DateTime.Hours + ':' + DateTime.Minutes + ':' + DateTime.Seconds;
				options.domPlaceHolder.text(options.DateTime);
			}
		},



		onClick : function(objOptions) {
			methods.init(objOptions);

			//
			// Make the parent selected
			options.Parent.addClass('selected');

			//
			// Get the currently set Date Time and build a moment object from it
			var domPlaceHolder = options.domPlaceHolder.text();
			var DateTimeObject = moment(domPlaceHolder, 'MM/DD/YYYY HH:mm:ss');
			
			//
			// Save the original DateTime
			options.OriginalDateTime = domPlaceHolder;
			options.DateTime         = domPlaceHolder;

			//
			// Create a DateTime object that has the DateTime split
			DateTime = {
				Day     : methods.makeIntDouble(DateTimeObject.date()),
				Month   : methods.makeIntDouble(DateTimeObject.month()+1),
				Year    : DateTimeObject.year(),
				Hours   : methods.makeIntDouble(DateTimeObject.hours()),
				Minutes : methods.makeIntDouble(DateTimeObject.minutes()),
				Seconds : methods.makeIntDouble(DateTimeObject.seconds())
			}

			//
			// get the HTML for the DateTimeEntry and append it to the parent
			html = methods.popupLayout();
			options.Parent.append(html);
			options.dateTimeEntryDisplay = options.Parent.find(options.PopUpClass);

			options.Parent.find( '#' + options.id + 'Month').val(DateTime.Month);
			options.Parent.find( '#' + options.id + 'Day').val(DateTime.Day);
			options.Parent.find( '#' + options.id + 'Year').val(DateTime.Year);
			options.Parent.find( '#' + options.id + 'Hours').val(DateTime.Hours);
			options.Parent.find( '#' + options.id + 'Minutes').val(DateTime.Minutes);
			options.Parent.find( '#' + options.id + 'Seconds').val(DateTime.Seconds);

			methods.showDateTimeEntry();

			$(document).unbind('mouseup').on('mouseup', function (e) {
				if (options.Parent.has(e.target).length === 0) {
					methods.hideDateTimeEntry();
				}
			});


				$.each(options.Parent.find('.dateformat-input'), function(event) {
					var _this = $(this);

					var AllowedLength  = ( _this.hasClass('year') ) ? 4 : 2;
					var ControlPressed = false;
					var RPressed       = false;
					var BrowserRefresh = false;


					//
					// Bind keydown event
					_this.unbind('keydown').on('keydown', function(event) {
						var _value  = _this.attr('value');
						var _length = _value.length;
						window.clearTimeout(methods.KeyDownTimeOut);

						//
						// We do not want to block keystrokes such as Tab, Enter, Shift, Esc, etc.
						var acceptableKeys = (event.keyCode >= 8 && event.keyCode <= 46) ? true : false;
						// Validation that the keystroke will either be acceptable or numerical
						var regex   = new RegExp("^[0-9]+$");

						//
						// Check if the user is actually trying to Reload the webpage
						if ( event.keyCode == 82 && ControlPressed ) {
							BrowserRefresh = true;
						}
						ControlPressed = ( event.keyCode == 17 );
						// check for reload keystrokes
						//

						//
						// To keep the keystrokes contained within this date input
						// and prevent an accidental tab to an element outside of the datetime inputs
						// The user presses Tab while the Seconds input is focused, redirect the focus to the Month input
						if ( $(this).hasClass('seconds') && event.keyCode == 9) {
							event.preventDefault();
							methods.KeyDownTimeOut = window.setTimeout(function() {
								$('.dateformat-input.month').select();
							}, 100);
							return false;
						}
						
						//
						// Since only Numbers should be entered, validate the char to make sure
						var key     = String.fromCharCode(!event.charCode ? event.which : event.charCode);
						var numPad  = (event.keyCode >= 96 && event.keyCode <= 115);
						if ( !regex.test(key) && !numPad && !acceptableKeys && !BrowserRefresh ) {
							event.preventDefault();
							return false;
						}
						// Numerical validation
						//

					});
					// End: keydown
					//

					//
					// Bind keyup event
					_this.unbind('keyup').on('keyup', function(event) {
						var _value = _this.attr('value');
						window.clearTimeout(methods.KeyUpTimeOut);

						var acceptableKeys = (event.keyCode >= 8 && event.keyCode <= 46) ? true : false;

						//
						// User pressed the Esc button. We'll assume they want to close dateTimeEntry
						if ( event.keyCode == 27 || event.keyCode == 13 ) {
							methods.hideDateTimeEntry();

						//
						// any other keystroke
						} else {

							//
							// user has entered the max allowed characters. tab to next input
							if ( _value.length == AllowedLength && !acceptableKeys ) {
								methods.KeyUpTimeOut = window.setTimeout(function() {
									_this.next('.dateformat-input').select();
								}, 100);
							}

							//
							// user has entered max allowed characters in the Seconds input. tab back to month
							if ( $(this).hasClass('seconds') && _value.length == AllowedLength && !acceptableKeys ) {
								methods.KeyUpTimeOut = window.setTimeout(function() {
									$('.dateformat-input.month').select();
								}, 100);
							}
						}

					});

					_this.unbind('change').on('change', function(event) {
						var InvalidFound = false;

						$.each(options.Parent.find('input'), function(event) {
							var _value = $(this).attr('value');
							var _class = $(this).attr('class');
							var _id    = $(this).attr('id');
							var _id    = _id.replace(options.id, '');

							if ( _id != 'Year') {
								_value = methods.makeIntDouble(_value);
								$(this).val(_value);
							}
							
							DateTime[_id] = _value;

							switch(_id) {
								case 'Month' :
									if ( _value > 12 ) {
										$(this).tooltip('Month is out of range');
										InvalidFound = true;
									}
									break;
								case 'Day' :
									if ( _value > 31 ) {
										$(this).tooltip('Day is out of range');
										InvalidFound = true;
									}
									break;
								case 'Hours' :
									if ( _value > 24 ) {
										$(this).tooltip('Hour is out of range');
										InvalidFound = true;
									}
									break;
								case 'Minutes' :
									if ( _value > 59 ) {
										$(this).tooltip('Minute is out of range');
										InvalidFound = true;
									}
									break;
								case 'Seconds' :
									if ( _value > 59 ) {
										$(this).tooltip('Seconds is out of range');
										InvalidFound = true;
									}
									break;
							}
						});
						
						methods.updateDateTime();

						if ( !InvalidFound ) {
							$.tooltip('fadeOut');
						}

					})


				});


				options.dateTimeEntryDisplay.find('.nowDate').unbind('click').bind('click', function() {

					var DateTimeObject = moment();

					//
					// Create a DateTime object that has the DateTime split
					DateTime = {
						Day     : methods.makeIntDouble(DateTimeObject.date()),
						Month   : methods.makeIntDouble(DateTimeObject.month()+1),
						Year    : DateTimeObject.year(),
						Hours   : methods.makeIntDouble(DateTimeObject.hours()),
						Minutes : methods.makeIntDouble(DateTimeObject.minutes()),
						Seconds : methods.makeIntDouble(DateTimeObject.seconds())
					}


					options.Parent.find( '#' + options.id + 'Month').val(DateTime.Month);
					options.Parent.find( '#' + options.id + 'Day').val(DateTime.Day);
					options.Parent.find( '#' + options.id + 'Year').val(DateTime.Year);
					options.Parent.find( '#' + options.id + 'Hours').val(DateTime.Hours);
					options.Parent.find( '#' + options.id + 'Minutes').val(DateTime.Minutes);
					options.Parent.find( '#' + options.id + 'Seconds').val(DateTime.Seconds).change();

				});
		},

	};

	$.fn.dateTimeEntry = function( method ) {

		// Method calling logic
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.createDateTimeEntry.apply( this, arguments );
		} else {
			return methods.createDateTimeEntry.apply(  this, arguments  );
		}

	};

})( jQuery );