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
                popup = preview.clone();
                popup.removeClass(opts.previewClass).addClass(opts.fullviewClass);
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
jQuery.fn.girdle.defaults = {
    previewClass:  'girdle-preview',
    fullviewClass: 'girdle-popup',
    fadeIn: 'slow',
    fadeOut: 'fast',
    fadeInDelay: 300,
    fadeOutDelay: 500
};