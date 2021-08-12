scrollIntoView(someElement, {

    time: 500, // half a second


    ease: function(value){
        return Math.pow(value,2) - value; // Do something weird.
    },

    validTarget: function(target, parentsScrolled){

        // Only scroll the first two elements that don't have the class "dontScroll"
        // Element.matches is not supported in IE11, consider using Element.prototype.msMatchesSelector if you need to support that browser

        return parentsScrolled < 2 && target !== window && !target.matches('.dontScroll');
    },

    align:{
        top: 0 to 1, default 0.5 (center)
        left: 0 to 1, default 0.5 (center)
        topOffset: pixels to offset top alignment
        leftOffset: pixels to offset left alignment,
        lockX: boolean to prevent X scrolling,
        lockY: boolean to prevent Y scrolling
    },

    isScrollable: function(target, defaultIsScrollable){

        // By default scroll-into-view will only attempt to scroll elements that have overflow not set to `"hidden"` and who's scroll width/height is larger than their client height.
        // You can override this check by passing an `isScrollable` function to settings:

        return defaultIsScrollable(target) || target !== window && ~target.className.indexOf('scrollable');
    },

    isWindow: function(target){
        // If you need special detection of the window object for some reason, you can do it here.
        return target.self === target;
    },

    cancellable: true, // default is true, set to false to prevent users from cancelling the scroll with a touch or mousewheel

    maxSynchronousAlignments: 3, // default is 3. Maximum number of times to try and align elements synchronously before completing.

    debug: true // default is false. This will spit out some logs that can help you understand what scroll-into-view is doing if it isn't doing what you expect.
});