/**
 * jquery.girdle - Helping that random piece of oversized content fit... 
 * Tri-Licensed: MPL 1.1, GPL 2.0, or LGPL 2.1
 * version 0.1
 */
/*jslint browser:true */ /*global jQuery*/
jQuery.fn.girdle = function (options) {
    var opts = jQuery.extend({}, jQuery.fn.girdle.defaults, options);
    return this.each(function () {
        var preview = jQuery(this),
            startFadeInTimeout;

        startFadeInTimeout = function () {
            var popup = null,
                fadeOutTimer = 0, 
                fadeInTimer = 0,
	        displayPopup,
                removePopup,
                clearFadeInTimeout,
                startFadeOutTimeout,
                clearFadeOutTimeout;

            displayPopup = function () {
                var left, zIndex;
                popup = preview.clone();
                popup.removeClass(opts.previewClass).addClass(opts.fullviewClass);
	        left = preview.position().left;
                zIndex = jQuery.fn.girdle.calculateZIndex(preview);

                popup.css({position: 'absolute',
	                   left: left + 'px',
	                   'z-index': zIndex});
                popup.insertBefore(preview).fadeIn(opts.fadeIn); //TODO make opts

                preview.unbind("mouseleave", clearFadeInTimeout);
                popup.bind("mouseleave", startFadeOutTimeout);
            };
            removePopup = function () {
                    popup.fadeOut(opts.fadeOut, function () {
                        popup.unbind("mouseenter", clearFadeOutTimeout);
                        // Reboots this cycle
                        preview.bind("mouseenter", startFadeInTimeout);
                        popup.remove();
                        popup = null;
                    }); 
            };
            clearFadeInTimeout = function () {
                // User didn't really want to show the popup
                preview.unbind("mouseleave", clearFadeInTimeout);
                clearTimeout(fadeInTimer);
                // reboot the process
                preview.bind("mouseenter", startFadeInTimeout); 
            };
            startFadeOutTimeout = function () {
                popup.unbind("mouseleave", startFadeOutTimeout);
                popup.bind("mouseenter", clearFadeOutTimeout);

                fadeOutTimer = setTimeout(removePopup, opts.fadeOutDelay);

                
            };
            clearFadeOutTimeout = function () {
                // User moused out and then swerve back in... let's not actually remove the popup... yet
                popup.unbind("mouseenter", clearFadeOutTimeout);
                popup.bind("mouseleave", startFadeOutTimeout);
                clearTimeout(fadeOutTimer);
            };

            // Do we really need a girdle or are we svelte enough?
            if (preview.width() - preview.children().width() > 10) {
                return;
            }

            fadeInTimer = setTimeout(displayPopup, opts.fadeInDelay);

            preview.bind("mouseleave", clearFadeInTimeout);
            preview.unbind("mouseenter", startFadeInTimeout);
                        
        }; // function startFadeOutTimeout 

        preview.addClass(opts.previewClass);
        preview.bind("mouseenter", startFadeInTimeout);

    }); // return this.each
}; // jQuery.fn.girdle
/**
 * Determines the proper z-index for the popup elment. It should be 
 * 1 more than the 'preview' elment. It recursively checks the parents
 * of preview.
 * 
 * TODO: Does this method already exist in jQuery?
 * @param jQuery elemnt - The preview element
 * @return integer - The new z-index appropriate for the popup element
 */
jQuery.fn.girdle.calculateZIndex = function(preview) {
    var zIndex = 'auto',
        parent = preview,
        DEFAULT_Z_INDEX = 2;
    while (zIndex == 'auto' && parent && ! parent.is('body')) {
        console.info('parent=', parent);
        var el = parent.get(0);
        if (el.currentStyle) { // IE
            zIndex = el.currentStyle['z-index'];
        } else if (window.getComputedStyle) {
            console.info('computing ', el);
            zIndex = document.defaultView.getComputedStyle(el, null).getPropertyValue('z-index');
        } else {
            return DEFAULT_Z_INDEX;
        }

        parent = parent.parent();
        console.info(zIndex, el, parent);
    }
    if (zIndex == 'auto') {
        return DEFAULT_Z_INDEX;
    } else {
        return parseInt(zIndex) + 1;
    }
}
jQuery.fn.girdle.defaults = {
    previewClass:  'girdle-preview',
    fullviewClass: 'girdle-popup',
    fadeIn: 'slow',
    fadeOut: 'fast',
    fadeInDelay: 300,
    fadeOutDelay: 500
};
