# Jquery Girdle Plugin #

**HELP** Does this already exist? I hate reinventing wheels....

Do you ever have that random piece of content that won't quite fit
into it's alloted slot? *Put a man-girdle on that piece*.

Demo: <http://ozten.com/jquery-girdle-plugin/demo.html>

## CSS ##
Style your content as normal. Create two classes that Girdle will add and remove. By default these are

* girdle-preview - Should set width to your maximum and overflow to hidden
* girdle-popup - Might not need anything... But use this to trick out your floating content.

## JavaScript ##
    $('.unruly-content').girdle(.{previewClass:  'unruly-preview',
                                  fullviewClass: 'unruly-popup'});

## Behind the scenese ##
Girdle applies the girdle-preview CSS class. When you hover over an element, Girdle will clone it and apply the girdle-popup CSS class. It will be positioned above the original content giving the illusion that you've reveled or popped up the constrained area.

## Performance Tip ##
If you wrap your content in another tag, Girdle will check to make sure your content really is larger before doing it's thang. See <a href="http://ozten.com/jquery-girdle-plugin/multi-demo.html">multi-demo.html</a> for an example.

## CREDITS ##
Inspired by Tinderbox Pushlog

The code is reworked from the function [UserInterface__installTooltips](http://tests.themasta.com/tinderboxpushlog/UserInterface.js)