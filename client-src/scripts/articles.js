const Utils = require("./utils.js")
const eventify = require("./event-emitter.js")
const CanvasImage = require("./canvas-image")
const Article = require("./article")

let isUserControlled = false

class Articles {

  constructor(scrollDuration, intervalRange, intervalRangeStatic){
    eventify(this)
    this.paused = true

    if(scrollDuration > intervalRange[0]){
      console.error("articles.js - Scroll duration is longer than min duration. Matched values.")
      scrollDuration = intervalRange[0]
    }

    this.iterations = 0
    this.timeoutId = -1
    this.timeoutIds = []
    this.elements = document.querySelectorAll('.js-article')
    this.items = []

    this.scrollDuration = scrollDuration || 500
    this.intervalRange = intervalRange || [ 500, 5000 ]
    this.intervalRangeStatic = intervalRangeStatic || [ 500, 1000 ]
    this.intervalRangeOriginal = intervalRange
  }

  setUserControl(hasControl){
    if(hasControl === isUserControlled) return
    isUserControlled = hasControl
    
    // If has control is true then restart.
    if(hasControl === true){
      this.iterations = 0
      this.intervalRange = this.intervalRangeOriginal
      // console.log("setUserControl() - pause() play()")
      this.pause()
      this.play()
    }
  }

  getUserControl(){
    return isUserControlled
  }
  
  pause(){
    // console.log("pause()")
    this.paused = true
    Utils.scrollStop()
    clearTimeout(this.timeoutId)
    this.timeoutIds.splice(this.timeoutIds.indexOf(this.timeoutId))
  }

  play(){
    if(this.paused == true){
      // console.log("play()")
      this.paused = false
      this.next()
    }
  }

  next(){
    if(this.paused == true) return

    this.iterations++
    if(this.iterations < 30 && this.iterations%4 === 0){
      this.intervalRange[0] = Math.round(this.intervalRange[0]*1.75)
      this.intervalRange[1] = Math.round(this.intervalRange[1]*1.75)
      // console.log("Range increase:", this.intervalRange)
    }

    let elIndex
    if(isUserControlled === true){
        const firstLastInView = Utils.elementIndexesInView(this.elements)
        elIndex = Math.randomRange(Math.max(0, firstLastInView[0]-3), Math.min(this.elements.length-1, firstLastInView[1]+3))
        this.intervalDuration = Math.randomRange(Math.round(this.intervalRangeStatic), Math.round(this.intervalRangeStatic))
      } else {
        elIndex = Math.floor(Math.random()*this.elements.length)
        this.intervalDuration = (this.scrollDuration) + Math.randomRange(this.intervalRange[0], this.intervalRange[1])
        console.log("scroll duration", this.scrollDuration, "min range", this.intervalRange[0])
      }
      
    // Choose random element and image
    const parentEl = this.elements[elIndex]
    const imageUrl = Utils.chooseRandomArray(window.images)
  
    const animationCompleteHandler = (doNotEmit) => {
      if(!doNotEmit)
        this.emit('article-complete')

      // For good measure
      clearTimeout(this.timeoutId)
      this.timeoutIds.splice(this.timeoutIds.indexOf(this.timeoutId))

      // Remove handler
      Utils.off('animation-complete', animationCompleteHandler)
      // Reveal image.
      this.items[elIndex] = new Article(parentEl, imageUrl)     
      // Go again.
      // console.log("This pause:", this.intervalDuration)
      
      
      const tId = setTimeout(this.next.bind(this), this.intervalDuration) 
      this.timeoutIds.push(tId)
      if(this.timeoutIds.length > 1){
        console.log('Articles - too many timeouts.', this.timeoutIds.length)
      }
      this.timeoutId = tId
    }

    if(isUserControlled === true){
      animationCompleteHandler(true)
    } else {
      Utils.on('animation-complete', animationCompleteHandler)
      Utils.scrollToElement(parentEl, this.scrollDuration)
    }

  }
  
  get(index){
    return this.items[index]
  }

  getHTMLElements(){
    return this.elements
  }
}

module.exports = Articles
