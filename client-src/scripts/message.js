class Message {

  constructor(el){
    this.hidden = true
    this.parent = el
    this.textEl = el.querySelector('.js-message-text')
  }

  show(msg){
    if(this.isShowing === true) return
    this.parent.classList.add('is-revealed')
    this.update(msg)
  }

  update(msg){
    this.isShowing = true
    this.textEl.innerHTML = msg
    setTimeout(this.hide.bind(this), Math.randomRange(4500, 5000))
  }

  hide(){
    this.isShowing = false
    this.parent.classList.remove('is-revealed')
  }

}

module.exports = Message
