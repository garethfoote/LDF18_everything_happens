class Message {

  constructor(el){
    this.hidden = true
    this.parent = el
    this.textEl = el.querySelector('.js-message-text')
  }

  show(msg){
    this.parent.classList.add('is-revealed')
    this.update(msg)
  }

  update(msg){
    this.textEl.innerHTML = msg
    // setTimeout(this.hide.bind(this), 5000)
  }

  hide(){
    this.parent.classList.remove('is-revealed')
  }

}

module.exports = Message
