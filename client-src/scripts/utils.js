const eventify = require('./event-emitter')

/**
 * JavaScript function prototype debouncer 2.0 - hnldesign.nl
 * Based on code by Paul Irish and the original debouncing function from John Hann
 * http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
 * Register debouncer as a function prototype.
 * Usage:
 * myfunction.deBounce(time, executeasap, caller);
 *
 * @param threshold - Integer. Time in ms to wait for repeated calls. If time passes without more requests, function is called
 * @param execAsap - Boolean. Reverses workings; call function on first request, stop subsequent calls within threshold
 * @param caller - String. Original event that requested the repeat, for usage in callback
 * @returns function {debounced}
 */
if (typeof Function.prototype.deBounce !== 'function') {
    Object.defineProperty(Function.prototype, 'deBounce', {
        value : function (threshold, execAsap, caller) {
            'use strict';
            var func = this;
            var timeout;
            return function debounced() {
                var obj = this;

                function delayed() {
                    if (!execAsap) {
                        func.apply(obj, [caller]);
                    }
                    timeout = null;
                }

                if (timeout) {
                    clearTimeout(timeout);
                } else {
                    if (execAsap) {
                        func.apply(obj, [caller]);
                    }
                }
                timeout = setTimeout(delayed, threshold || 100);
            };
        }
    });
}

Math.map = (num, in_min, in_max, out_min, out_max) => {
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

//t = current time
//b = start value
//c = change in value
//d = duration
Math.easeInOutQuad = (t, b, c, d) => {
    t /= d/2
    if (t < 1) return c/2*t*t + b
    t--
    return -c/2 * (t*(t-2) - 1) + b
}

Math.randomRange = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

let Utils = {
    stopForceScrolling : false
}

const getOffset = (el) => {
    const rect = el.getBoundingClientRect()
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}

const isInViewport = (elem) => {
    var bounding = elem.getBoundingClientRect();
    return (
        bounding.top >= 0 &&
        bounding.left >= 0 &&
        bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
};

const scrollStop = () => {
  Utils.stopForceScrolling = true
  clearTimeout(Utils.scrollTimeoutId)
}

const scrollToY = (to, duration) => {
  let start = window.scrollY,
      change = to - start,
      currentTime = 0,
      increment = 20

  Utils.stopForceScrolling = false
  const animateScroll = () => {   
      currentTime += increment
      const val = Math.easeInOutQuad(currentTime, start, change, duration);
      window.scroll(0, val)
      if(Utils.stopForceScrolling === false && currentTime < duration) {
        const tId = setTimeout(animateScroll, increment)
        Utils.scrollTimeoutId = tId
      } else {
        if(Utils.stopForceScrolling === false) 
          Utils.emit('animation-complete')
      }
  }
  animateScroll()
}

const scrollToElement = (parentEl, scrollDuration) => {
    const viewportHeight = document.documentElement.clientHeight
    const yPos = getOffset(parentEl).top - (viewportHeight/2)
    scrollToY(yPos, scrollDuration)
}

const chooseRandomArray = (arr) => {
    const index = Math.floor(Math.random()*arr.length)
    return arr[index] 
}

const throttle = (callback, delay) => {
    let isThrottled = false, args, context;

    function wrapper() {
        if (isThrottled) {
        args = arguments;
        context = this;
        return;
        }

        isThrottled = true;
        callback.apply(this, arguments);
        
        setTimeout(() => {
        isThrottled = false;
        if (args) {
            wrapper.apply(context, args);
            args = context = null;
        }
        }, delay);
    }

    return wrapper;
}

const elementIndexesInView = (imgElements) => {
    const firstLast = []
    const imgElementsArray = Array.from(imgElements)

    imgElementsArray.some((el, i) => {
        firstLast[0] = i
        return Utils.isInViewport(el)
    })

    imgElementsArray.reverse()
    
    imgElementsArray.some((el, i) => {
        firstLast[1] = imgElementsArray.length-i-1
        return Utils.isInViewport(el)
    })

    return firstLast
}

Utils.throttled = (delay, fn) => {
    let lastCall = 0;
    return function (...args) {
        const now = (new Date).getTime();
        if (now - lastCall < delay) {
            return;
        }
        lastCall = now;
        return fn(...args);
    }
}

Utils.debounced = (delay, fn) => {
    let timerId;
    return function (...args) {
        if (timerId) {
            clearTimeout(timerId);
        }
        timerId = setTimeout(() => {
            fn(...args);
            timerId = null;
        }, delay);
    }
}


Utils = Object.assign({}, Utils, {
    getOffset,
    scrollToY,
    scrollToElement,
    scrollStop,
    chooseRandomArray,
    throttle,
    isInViewport,
    elementIndexesInView
})

module.exports = eventify(Utils)
