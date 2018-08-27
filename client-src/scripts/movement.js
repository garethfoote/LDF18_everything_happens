"use strict"
const Resize = require("./resize")

class Movement {
    constructor(startPauseDuration, mouseStoppedCb, mouseStartedCb, scrollStartedCb) {
        this.startPauseDuration = startPauseDuration
        this.mouseStoppedCb = mouseStoppedCb
        this.mouseStartedCb = mouseStartedCb
        this.scrollStartedCb = scrollStartedCb

        this.wasMouseMoveDebouncedTriggered = false
        this.wasMouseMoveThrottledTriggered = false
        this.wasScrollThrottledTriggered = false
        
        setInterval(this.intervalAction.bind(this), 200);

        this.handleDebouncedMouseMove = this.handleDebouncedMouseMove()
        this.handleThrottledMouseMove = this.handleThrottledMouseMove()
        this.handleThrottledScroll = this.handleThrottledScroll()

        // const scrollStarted = Utils.throttled(this.scrollStartedCb, 600);
        // const mouseStarted = Utils.throttled(this.mouseStartedCb, 400);
        // const mouseStopped = Utils.debounced(this.mouseStoppedCb, this.startPauseDuration);
        
        window.addEventListener('scroll', (event) => {
            // console.log("mouse move triggered", this.handleDebouncedMouseMoveProxy)
            // scrollStarted()
            this.handleThrottledScroll()
        }, false)

        document.addEventListener('mousemove', (event) => {
            // console.log("mouse move triggered", this.handleDebouncedMouseMoveProxy)
            this.handleDebouncedMouseMove()
            this.handleThrottledMouseMove()
            // mouseStarted()
            // mouseStopped()
        }, false)

    }

    handleDebouncedMouseMove(){ 
        var timeWindow = this.startPauseDuration
        var timeout = null
    
        var debouncedEvent = function (args) {
            this.wasMouseMoveDebouncedTriggered = true
        }
    
        return function () {
            // console.log("return return", this)
            var context = this
            var args = arguments
            clearTimeout(timeout)
            timeout = setTimeout(function () {
                debouncedEvent.apply(context, args)
            }, timeWindow)
        }
    }

    handleThrottledMouseMove(){
        var timeWindow = 400
        var lastExecution = new Date((new Date()).getTime() - timeWindow)
    
        var throttledEvent = function () {
        //   console.log("mouse move throttled triggered")
          this.wasMouseMoveThrottledTriggered = true
        }
    
        return function () {
          if ((lastExecution.getTime() + timeWindow) <= (new Date()).getTime()) {
            lastExecution = new Date()
            return throttledEvent.bind(this)()
          }
        }
    }

    handleThrottledScroll(){
        var timeWindow = 600
        var lastExecution = new Date((new Date()).getTime() - timeWindow)
    
        var throttledEvent = function () {
        //   console.log("mouse move throttled triggered")
          this.wasScrollThrottledTriggered = true
        }
    
        return function () {
          if ((lastExecution.getTime() + timeWindow) <= (new Date()).getTime()) {
            lastExecution = new Date()
            return throttledEvent.bind(this)()
          }
        }
    }

    intervalAction(){
        if (this.wasMouseMoveDebouncedTriggered) {
            // this.startCb()
            // console.log('mouse start');
            this.mouseStoppedCb()
        }
    
        if (this.wasMouseMoveThrottledTriggered) {
            // console.log('mouse stop');
            this.mouseStartedCb()
        }

        if (this.wasScrollThrottledTriggered) {
            // console.log('scroll stop');
            this.scrollStartedCb()
        }
    
        this.wasMouseMoveDebouncedTriggered = false
        this.wasMouseMoveThrottledTriggered = false
        this.wasScrollThrottledTriggered = false
    }

}

module.exports = Movement









