!function(t){var e={};function n(i){if(e[i])return e[i].exports;var o=e[i]={i:i,l:!1,exports:{}};return t[i].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=t,n.c=e,n.d=function(t,e,i){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)n.d(i,o,function(e){return t[e]}.bind(null,o));return i},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=2)}([function(t,e,n){"use strict";var i=function(){var t=[],e=!1;function n(){e||(e=!0,window.requestAnimationFrame?window.requestAnimationFrame(i):setTimeout(i,66))}function i(){t.forEach(function(t){t()}),e=!1}return{add:function(e){t.length||window.addEventListener("resize",n),function(e){e&&t.push(e)}(e)}}}();t.exports=i},function(t,e,n){"use strict";"function"!=typeof Function.prototype.deBounce&&Object.defineProperty(Function.prototype,"deBounce",{value:function(t,e,n){var i,o=this;return function(){var r=this;i?clearTimeout(i):e&&o.apply(r,[n]),i=setTimeout(function(){e||o.apply(r,[n]),i=null},t||100)}}}),Math.easeInOutQuad=function(t,e,n,i){return(t/=i/2)<1?n/2*t*t+e:-n/2*(--t*(t-2)-1)+e},Math.randomRange=function(t,e){return Math.floor(Math.random()*(e-t+1)+t)};var i={stopForceScrolling:!1},o=function(t){var e=t.getBoundingClientRect(),n=window.pageXOffset||document.documentElement.scrollLeft,i=window.pageYOffset||document.documentElement.scrollTop;return{top:e.top+i,left:e.left+n}},r=function(t,e){var n=window.scrollY,o=t-n,r=0;!function t(){r+=20;var s=Math.easeInOutQuad(r,n,o,e);window.scroll(0,s),r<e&&(i.scrollTimeoutId=setTimeout(t,20))}()};i.throttled=function(t,e){var n=0;return function(){var i=(new Date).getTime();if(!(i-n<t))return n=i,e.apply(void 0,arguments)}},i.debounced=function(t,e){var n=void 0;return function(){for(var i=arguments.length,o=Array(i),r=0;r<i;r++)o[r]=arguments[r];n&&clearTimeout(n),n=setTimeout(function(){e.apply(void 0,o),n=null},t)}},i={getOffset:o,scrollToY:r,scrollToElement:function(t,e){var n=document.documentElement.clientHeight,i=o(t).top-n/2;r(i,e)},scrollStop:function(){i.stopForceScrolling=!0,clearTimeout(i.scrollTimeoutId)},chooseRandomArray:function(t){return t[Math.floor(Math.random()*t.length)]},throttle:function(t,e){var n=!1,i=void 0,o=void 0;return function r(){if(n)return i=arguments,void(o=this);n=!0,t.apply(this,arguments),setTimeout(function(){n=!1,i&&(r.apply(o,i),i=o=null)},e)}},isInViewport:function(t){var e=t.getBoundingClientRect();return e.top>=0&&e.left>=0&&e.bottom<=(window.innerHeight||document.documentElement.clientHeight)&&e.right<=(window.innerWidth||document.documentElement.clientWidth)},elementIndexesInView:function(t){var e=[],n=Array.from(t);return n.some(function(t,n){return e[0]=n,i.isInViewport(t)}),n.reverse(),n.some(function(t,o){return e[1]=n.length-o,i.isInViewport(t)}),e}},t.exports=i},function(t,e,n){"use strict";n(3);var i=n(1),o=n(4),r=n(5),s=n(6);window.images||console.error("No image array available");var a=new o(document.getElementById("bg")),u=document.querySelectorAll(".js-pixelate"),c=document.querySelector(".js-message"),h=[],l=500+Math.randomRange(500,2500),d=!1;Array.from(u).forEach(function(t,e){t.addEventListener("mouseover",function(t){null!=h[e]&&h[e].toggleAnim()})});var f=function(){1},m=function(){console.log("mouse started",d),0==d&&(c.parentNode.classList.add("is-hidden"),setTimeout(function(){c.innerHTML="You have regained control",c.style.animationDelay="-0.1s",c.parentNode.classList.remove("is-hidden"),setTimeout(function(){c.parentNode.classList.add("is-hidden")},2e4)},500)),d=!0,i.scrollStop()},v=function(){1==d&&(c.parentNode.classList.add("is-hidden"),setTimeout(function(){c.innerHTML="The bots are back",c.style.animationDelay="-0.1s",c.parentNode.classList.remove("is-hidden"),setTimeout(function(){c.parentNode.classList.add("is-hidden")},2e4)},500)),d=!1,c.innerHTML="You have regained control.",console.log("mouse stopped",d)},g=void 0,p=void 0;window.addEventListener("mousemove",function(t){var e=t.clientX,n=t.clientY;a.moveHandler.apply(a,[e,n]);var i="";p<n?i+="s":p>n&&(i+="n"),g<e?i+="e":g>e&&(i+="w"),document.body.style.cursor=i+"-resize",g=e,p=n});!function t(){var e=void 0;if(!0===d){var n=i.elementIndexesInView(u);e=Math.randomRange(n[0],n[1]),l=Math.randomRange(500,1500)}else e=Math.floor(Math.random()*u.length),l=500+Math.randomRange(500,2500);var o=u[e],s=i.chooseRandomArray(window.images);!1===d&&(console.log("user controlled",d),i.scrollToElement(o,500)),setTimeout(function(){h[e]=new r(o,s)},!1===d?500:1),setTimeout(t.bind(void 0),l)}(),new s(5e3,v,m,f),a.pulse()},function(t,e,n){t.exports=n.p+"bundle.css"},function(t,e,n){"use strict";var i=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}();var o=n(0),r=(n(1),function(){function t(e){var n=this;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.gridSpace=16,this.canvas=e,this.currentAnimSize=1,this.animDir=1,this.pixelRatio=window.devicePixelRatio||1,this.ctx=e.getContext("2d"),this.size(),this.draw(),o.add(function(){n.size(),n.draw()}),this.easedX=0,this.easedY=0,this.xPos=0,this.yPos=0}return i(t,[{key:"moveHandler",value:function(t,e){this.xPos=Math.round(t/this.gridSpace),this.yPos=Math.round(e/this.gridSpace)}},{key:"size",value:function(){this.width=Math.max(document.documentElement.clientWidth,window.innerWidth||0),this.height=Math.max(document.documentElement.clientHeight,window.innerHeight||0),this.canvas.width=this.width*this.pixelRatio,this.canvas.height=this.height*this.pixelRatio,this.canvas.style.width=this.width+"px",this.canvas.style.height=this.height+"px",this.ctx.scale(this.pixelRatio,this.pixelRatio)}},{key:"draw",value:function(){this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this.ctx.fillStyle="rgba(0, 0, 255, 0.5)";for(var t=this.gridSpace;t<this.width;t+=this.gridSpace)for(var e=this.gridSpace;e<this.height;e+=this.gridSpace)this.ctx.beginPath(),this.ctx.ellipse(t,e,1,1,45*Math.PI/180,0,2*Math.PI),this.ctx.fill()}},{key:"randomPulseLocation",value:function(){this.yPos%2==0&&(Math.random()>.5?this.xPos++:this.xPos--),this.xPos%2==1&&(Math.random()>.5?this.yPos++:this.yPos--)}},{key:"pulse",value:function(){this.draw();var t=this.xPos*this.gridSpace,e=this.yPos*this.gridSpace;this.ctx.beginPath(),this.ctx.ellipse(t,e,this.currentAnimSize,this.currentAnimSize,45*Math.PI/180,0,2*Math.PI),this.ctx.fill(),(this.currentAnimSize>=20||this.currentAnimSize<=0)&&(this.animDir*=-1),this.currentAnimSize+=this.animDir,requestAnimationFrame(this.pulse.bind(this))}}]),t}());t.exports=r},function(t,e,n){"use strict";var i=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}();n(0);var o={blocks:5},r=function(){function t(e,n){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t);var i=e.querySelector("canvas");this.config=o,this.dx=-.5,this.v=Math.min(25,this.config.blocks),this.canvas=i||document.createElement("canvas"),this.canvas.width=800,this.canvas.height=450,e.appendChild(this.canvas),this.ctx=this.canvas.getContext("2d"),this.img=new Image,this.ctx.mozImageSmoothingEnabled=!1,this.ctx.webkitImageSmoothingEnabled=!1,this.ctx.imageSmoothingEnabled=!1,this.img.onload=this.pixelate.bind(this),this.img.src=n}return i(t,[{key:"pixelate",value:function(t){var e=.01*this.v,n=this.canvas.width*e,i=this.canvas.height*e;this.ctx.drawImage(this.img,0,0,n,i),this.ctx.drawImage(this.canvas,0,0,n,i,0,0,this.canvas.width,this.canvas.height)}},{key:"toggleAnim",value:function(){this.dx*=-1,this.anim()}},{key:"anim",value:function(){this.v+=this.dx,this.pixelate(this.v),(this.dx<0&&this.v>5||this.dx>0&&this.v<25)&&requestAnimationFrame(this.anim.bind(this))}}]),t}();t.exports=r},function(t,e,n){"use strict";var i=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}();n(0);var o=function(){function t(e,n,i,o){var r=this;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.startPauseDuration=e,this.mouseStoppedCb=n,this.mouseStartedCb=i,this.scrollStartedCb=o,this.wasMouseMoveDebouncedTriggered=!1,this.wasMouseMoveThrottledTriggered=!1,this.wasScrollThrottledTriggered=!1,setInterval(this.intervalAction.bind(this),200),this.handleDebouncedMouseMove=this.handleDebouncedMouseMove(),this.handleThrottledMouseMove=this.handleThrottledMouseMove(),this.handleThrottledScroll=this.handleThrottledScroll(),window.addEventListener("scroll",function(t){r.handleThrottledScroll()},!1),document.addEventListener("mousemove",function(t){r.handleDebouncedMouseMove(),r.handleThrottledMouseMove()},!1)}return i(t,[{key:"handleDebouncedMouseMove",value:function(){var t=this.startPauseDuration,e=null;return function(){var n=this,i=arguments;clearTimeout(e),e=setTimeout(function(){(function(t){this.wasMouseMoveDebouncedTriggered=!0}).apply(n,i)},t)}}},{key:"handleThrottledMouseMove",value:function(){var t=new Date((new Date).getTime()-400);return function(){if(t.getTime()+400<=(new Date).getTime())return t=new Date,function(){this.wasMouseMoveThrottledTriggered=!0}.bind(this)()}}},{key:"handleThrottledScroll",value:function(){var t=new Date((new Date).getTime()-600);return function(){if(t.getTime()+600<=(new Date).getTime())return t=new Date,function(){this.wasScrollThrottledTriggered=!0}.bind(this)()}}},{key:"intervalAction",value:function(){this.wasMouseMoveDebouncedTriggered&&this.mouseStoppedCb(),this.wasMouseMoveThrottledTriggered&&this.mouseStartedCb(),this.wasScrollThrottledTriggered&&this.scrollStartedCb(),this.wasMouseMoveDebouncedTriggered=!1,this.wasMouseMoveThrottledTriggered=!1,this.wasScrollThrottledTriggered=!1}}]),t}();t.exports=o}]);
//# sourceMappingURL=bundle.js.map