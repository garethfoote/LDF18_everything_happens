class PageVisible {
  constructor(focusCb, blurCb){
    this.focusCb = focusCb
    this.blurCb = blurCb
    
    window.onfocus = this.focusHandler.bind(this)
    window.onblur = this.blurHandler.bind(this)

    this.focusHandler()
  }

  focusHandler(){
    this.focusCb()
    this.visible = true 
    document.body.classList.remove('has-lost-focus')
  }

  blurHandler(){
    this.blurCb()
    this.visible = false 
    document.body.classList.add('has-lost-focus')
  }

}

module.exports = PageVisible
