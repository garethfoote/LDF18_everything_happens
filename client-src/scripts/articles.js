const Utils = require("./utils.js")
const CanvasImage = require("./canvas-image")
const Article = require("./article")

let isUserControlled = false

class Articles {

  constructor(scrollDuration, intervalRange){
    this.paused = true

    this.timeoutId = -1
    this.elements = document.querySelectorAll('.js-article')
    this.items = []

    this.scrollDuration = scrollDuration || 500
    this.intervalRange = intervalRange || [500, 5000]

  }

  setUserControl(hasControl){
    isUserControlled = hasControl
    if(hasControl === true){
      this.pause()
      this.play()
    }
  }

  getUserControl(){
    return isUserControlled
  }
  
  pause(){
    Utils.scrollStop()
    clearTimeout(this.timeoutId)
    this.paused = true
  }

  play(){
    if(this.paused == true){
      this.paused = false
      this.next()
    }
  }

  next(){
    console.log('play')
    if(this.paused == true) return

    let elIndex
    if(isUserControlled === true){
        const firstLastInView = Utils.elementIndexesInView(this.elements)
        console.log(firstLastInView)
        elIndex = Math.randomRange(Math.max(0, firstLastInView[0]-3), Math.min(this.elements.length-1, firstLastInView[1]+3))
        console.log(elIndex)
        this.intervalDuration = Math.randomRange(this.intervalRange[0], this.intervalRange[1]/2)
      } else {
        elIndex = Math.floor(Math.random()*this.elements.length)
        this.intervalDuration = (this.scrollDuration) + Math.randomRange(this.intervalRange[0], this.intervalRange[1])
      }
      
    // Choose random element and image
    const parentEl = this.elements[elIndex]
    const imageUrl = Utils.chooseRandomArray(window.images)
  
    const animationCompleteHandler = () => {
      // Remove handler
      Utils.off('animation-complete', animationCompleteHandler)
      // Reveal image.
      this.items[elIndex] = new Article(parentEl, imageUrl)     
      // Go again.
      this.timeoutId = setTimeout(this.next.bind(this), this.intervalDuration) 
    }

    if(isUserControlled === true){
      animationCompleteHandler()
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
