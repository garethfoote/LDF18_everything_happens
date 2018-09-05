const Utils = require("./utils")
const CanvasImage = require("./canvas-image")

class Article {

  constructor(parentEl, imageUrl){
    // console.log(parentEl)
    const imageEl = parentEl.querySelector('.js-article-pixelate')
    this.textEl = parentEl.querySelector('.js-article-bold')

    this.canvasImage = new CanvasImage(imageEl, imageUrl)

    this.bold()
  }

  bold(){
    const words = this.textEl.textContent.toString().trim().split(' ')

    let newText = ''
    const boldIndex = Math.randomRange(1, words.length-1)
    words.forEach((word, i) => {
      if(i == boldIndex){
        newText += `<b>${word}</b> `
      } else {
        newText += word + ' '
      }
    })
    
    newText = newText.trim()
    this.textEl.innerHTML = newText
  }

  toggleAnim(){
    this.canvasImage.toggleAnim()
  }

}

module.exports = Article
