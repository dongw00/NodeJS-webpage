/*
 *  jquery-boilerplate - v4.0.0
 *  A jump-start for jQuery plugins development.
 *  http://jqueryboilerplate.com
 *
 *  Made by Zeno Rocha
 *  Under MIT License
 */
// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;( function( $, window, document, undefined ) {

	 "use strict";

		// Create the defaults once
		var pluginName = "responsive";

		// The actual plugin constructor
		function Plugin ( element, options ) {
			this.element = element;
			this.settings = $.extend( {
				key: ''
			}, options );
			this._name = pluginName;
			this.init();
		}
		// Avoid Plugin.prototype conflicts
		$.extend( Plugin.prototype, {			
			init: function() {
				var base = this;
				$('iframe').each(function(){
				  let thisIframe = $(this);
				  let theURL = $(this).prop('src');
				  if (theURL.indexOf('youtube') > 0) {
					let startOfCode = theURL.indexOf('embed/') + 6;
					let videoID = theURL.substr(startOfCode, theURL.length);
					let jsonURL = 'https://www.googleapis.com/youtube/v3/videos?part=player&id=' + videoID + '&key=' + base.settings.key;
					$.getJSON(jsonURL, function(data){ 
						let embedString = data.items[0].player.embedHtml;
						let widthPos = embedString.indexOf('width="') + 7;
						let theWidth = parseInt(embedString.substr(widthPos, 4));
						let heightPos = embedString.indexOf('height="') + 8;
						let theHeight = parseInt(embedString.substr(heightPos, 4));
						let ratio = theHeight / theWidth * 100;
						embedString = $('<style>.videoWrapper{position:relative;padding-bottom: '+ ratio + '%;}.videoWrapper iframe{position:absolute;top:0;left:0;width:100%;height:100%;}</style><div class="videoWrapper"><iframe src="https://www.youtube.com/embed/' + videoID + '" frameborder="0" gesture="media" allow="encrypted-media" allowfullscreen></iframe></div>');
						$(thisIframe).replaceWith(embedString);
					});
				  } 
				});
			}
			
		});

		// A really lightweight plugin wrapper around the constructor,
		// preventing against multiple instantiations
		$.fn[ pluginName ] = function( options ) {
			return this.each( function() {
				if ( !$.data( this, "plugin_" + pluginName ) ) {
					$.data( this, "plugin_" +
						pluginName, new Plugin( this, options ) );
				}
			} );
		};

} )( jQuery, window, document );