const Utils = require("./utils.js")
const eventify = require("./event-emitter.js")
const CanvasImage = require("./canvas-image")
const Article = require("./article")

let isUserControlled = false

class Articles {

  constructor(scrollDuration, intervalRange){
    eventify(this)
    this.paused = true

    this.timeoutId = -1
    this.elements = document.querySelectorAll('.js-article')
    this.items = []

    this.scrollDuration = scrollDuration || 500
    this.intervalRange = intervalRange || [ 500, 5000 ]
  }

  setUserControl(hasControl){
    if(hasControl === isUserControlled) return
    isUserControlled = hasControl

    // If has control is true then restart.
    if(hasControl === true){
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
    Utils.scrollStop()
    clearTimeout(this.timeoutId)
    this.paused = true
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

    let elIndex
    if(isUserControlled === true){
        const firstLastInView = Utils.elementIndexesInView(this.elements)
        elIndex = Math.randomRange(Math.max(0, firstLastInView[0]-3), Math.min(this.elements.length-1, firstLastInView[1]+3))
        this.intervalDuration = Math.randomRange(this.intervalRange[0], this.intervalRange[1]/2)
      } else {
        elIndex = Math.floor(Math.random()*this.elements.length)
        this.intervalDuration = (this.scrollDuration) + Math.randomRange(this.intervalRange[0], this.intervalRange[1])
      }
      
    // Choose random element and image
    const parentEl = this.elements[elIndex]
    const imageUrl = Utils.chooseRandomArray(window.images)
  
    const animationCompleteHandler = (doNotEmit) => {
      if(!doNotEmit)
        this.emit('article-complete')

      // Remove handler
      Utils.off('animation-complete', animationCompleteHandler)
      // Reveal image.
      this.items[elIndex] = new Article(parentEl, imageUrl)     
      // Go again.
      this.timeoutId = setTimeout(this.next.bind(this), this.intervalDuration) 
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
