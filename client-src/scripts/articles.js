const Utils = require("./utils.js")
const CanvasImage = require("./canvas-image")
const Article = require("./article")

let isUserControlled = false

class Articles {

  constructor(scrollDuration){
    this.paused = true

    this.timeoutId = -1
    this.elements = document.querySelectorAll('.js-article')
    this.items = []

    this.scrollDuration = scrollDuration
    this.intervalDuration = this.scrollDuration + Math.randomRange(500, 5000)
  }

  setUserControl(hasControl){
    isUserControlled = hasControl
    if(hasControl === true){
      Utils.scrollStop()  
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
    this.paused = false
    this.next()
  }

  next(){
    if(this.paused == true) return

    let elIndex
    if(isUserControlled === true){
        const firstLastInView = Utils.elementIndexesInView(this.elements)
        elIndex = Math.randomRange(firstLastInView[0], firstLastInView[1])
        this.intervalDuration = Math.randomRange(500, 1500)
    } else {
        elIndex = Math.floor(Math.random()*this.elements.length)
        this.intervalDuration = this.scrollDuration + Math.randomRange(500, 2500)
    }
  
    // Choose random element and image
    const parentEl = this.elements[elIndex]
    const imageUrl = Utils.chooseRandomArray(window.images)
    
    // Scroll to it
    if(isUserControlled === false){
        Utils.scrollToElement(parentEl, this.scrollDuration)
    }
  
    // and reveal/pixelate after scroll delay
    setTimeout(() => {
        // this.articles[elIndex] = new CanvasImage(parentEl, imageUrl)
        this.items[elIndex] = new Article(parentEl, imageUrl)
    }, (isUserControlled === false ? this.scrollDuration : 1))
  
    // Go again.
    this.timeoutId = setTimeout(this.next.bind(this), this.intervalDuration)

  }

  get(index){
    return this.items[index]
  }

  getHTMLElements(){
    return this.elements
  }
}

module.exports = Articles
