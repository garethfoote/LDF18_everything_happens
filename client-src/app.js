require("./styles/main.scss");
const Utils = require("./scripts/utils.js")
const CanvasGrid = require("./scripts/canvas-grid")
const CanvasImage = require("./scripts/canvas-image")
const Movement = require("./scripts/movement")
const Articles = require("./scripts/articles")
const PageVisible = require("./scripts/page-visibility")

if(!window.images){
  console.error("No image array available");
}
const articles = new Articles(750)
// Visibility
const pageVisible = new PageVisible(() => { /* articles.play() */ }, () => { articles.pause() })
// GRID
const grid = new CanvasGrid(document.getElementById("bg"))

// SOCKETS
const socketIn = require('socket.io-client')()
const socketOut = require('socket.io-client')('http://localhost:3001', {
  path: '/socket.io'
})

socketIn.on('visitor', function(msg){
  console.log('in -> out: ' + msg);
  if(pageVisible.visible && socketOut) socketOut.emit('visitor', msg)
})

// MESSAGES
const messageEl = document.querySelector('.js-message')
messageEl.innerHTML = "You have regained control."

// INTERACTION
Array.from(articles.getHTMLElements()).forEach((el, i) => {
  el.addEventListener('mouseover', (e) => {
    if(articles.get(i) != null){
      articles.get(i).toggleAnim()
    }
  })

  // el.addEventListener('click', (e) => {
  //   if(images.articles[i] != null){
  //     images.articles[i].toggleAnim()
  //   }
  // })
})

// MOVEMENT
const mouseStarted = () => {  
  if(articles.getUserControl() == false){
    if(pageVisible.visible && socketOut) socketOut.emit('mouse-started')
    console.log("mouse started", articles.getUserControl())
  }
  articles.setUserControl(true)  
}

const mouseStopped = () => {
  if(articles.getUserControl() == true){
    if(pageVisible.visible && socketOut) socketOut.emit('mouse-stopped')
    console.log("mouse stopped", articles.getUserControl())
  }
  articles.setUserControl(false)
}

let lastPosX, lastPosY
let cursorSwitch = true
window.addEventListener('mousemove', (e) => { 
    const mouseX = e.clientX
    const mouseY = e.clientY

    grid.moveHandler.apply(grid, [mouseX, mouseY])

    const left = false;
    const right = false;
    const up = false;
    const down = false;
   
    let direction = ""

    if(lastPosY < mouseY) {
        direction += "s"
    } else if(lastPosY > mouseY) {
        direction += "n"
    }
    if(lastPosX < mouseX) {
        direction += "e"
    } else if(lastPosX > mouseX) {
        direction += "w"
    }

    if(cursorSwitch == true)
        document.body.style.cursor = direction + "-resize"
    else 
        document.body.style.cursor = "auto"

    lastPosX = mouseX
    lastPosY = mouseY
})

articles.setUserControl(true)
articles.play()
// const movement = new Movement(5000, mouseStopped, mouseStarted, ()=>{});
// grid.pulse()
