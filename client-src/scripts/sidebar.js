class Sidebar {

  constructor(el){
    this.animateSlideInIndex = 0
    this.hidden = true
    this.parent = el

    // setInterval(this.animate.bind(this), 7200)
    this.animate()
  }

  add(msg){
    const slideIn = this.parent.querySelector(':scope > div')
    console.log(slideIn)
    const p = document.createElement("p")
    p.appendChild(document.createTextNode(msg))
    slideIn.insertBefore(p, slideIn.firstChild)
  }

  show(){
    this.parent.classList.add('is-revealed')
  }

  hide(){
    this.parent.classList.remove('is-revealed')
  }

  animate(){
    const messages = this.parent.querySelectorAll(':scope p')
    if(messages.length === 0){
      setTimeout(this.animate.bind(this), 2000)
      return
    }
    messages.forEach((el, i) => {
      el.classList.remove('do-animate')
      if(this.animateSlideInIndex === i){
        el.addEventListener('animationiteration', this.animate.bind(this))
        el.classList.add('do-animate')
      }
    })
    this.animateSlideInIndex++
    if(this.animateSlideInIndex > messages.length-1){
      this.animateSlideInIndex = 0
    }
  }
}

module.exports = Sidebar
