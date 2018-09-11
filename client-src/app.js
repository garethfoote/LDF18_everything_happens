require("./styles/main.scss");
const Utils = require("./scripts/utils.js")
const CanvasGrid = require("./scripts/canvas-grid")
const CanvasImage = require("./scripts/canvas-image")
const Movement = require("./scripts/movement")
const Articles = require("./scripts/articles")
const PageVisible = require("./scripts/page-visibility")
const Message = require("./scripts/message")
const Sidebar = require("./scripts/sidebar")
const extensionId = window.chromeExt || "lheecdgjlmiiabcpamfcpnjgppieneim";

console.log('Chrome Extension ID: ', extensionId)

if(!window.images){
  console.error("No image array available");
}

// ARTICLES
const articles = new Articles(750, [1000, 2500])
// VISIBILITY
const pageVisible = new PageVisible(articles.play.bind(articles), articles.pause.bind(articles))
// const pageVisible = new PageVisible(()=>{}, ()=>{})
// GRID
const grid = new CanvasGrid(document.getElementById("bg"))
// MESSAGE
const message = new Message(document.querySelector('.js-message'))
const sidebar = new Sidebar(document.querySelector('.js-sidebar'))
sidebar.show()
// SOCKETS
const socketIn = require('socket.io-client')()
const socketOut = require('socket.io-client')('http://localhost:3001', {
  path: '/socket.io'
})


let quantTimeoutId = -1
let currentCount = Number(localStorage.globalCount)
const updateCount = () => {
  clearTimeout(quantTimeoutId);
  let delta = Math.abs(currentCount - Number(localStorage.globalCount))
  let direction = (currentCount > Number(localStorage.globalCount)) ? -1 : 1
  direction = (delta == 0) ? 0 : direction
  if(delta != 0){
    currentCount += (Math.min(10, delta)*direction)
    socketOut.emit('visitor', currentCount)
    quantTimeoutId = setTimeout(updateCount, 10)
  }
  // } else {
  //   if(!noTimeout) quantTimeoutId = setTimeout(updateCount, Math.randomRange(5000, 10000))
  // }
}
updateCount()

articles.on('article-complete', ()=>{
  localStorage.globalCount = Number(localStorage.globalCount)+1
  updateCount()
})

grid.on('mouse-move', () => {
  localStorage.globalCount = Number(localStorage.globalCount)-1
  updateCount()
})

socketIn.on('visitor', function(msg){
  // Add user agent to sidebar
  sidebar.add(msg.userAgent)
  // Update global count
  localStorage.globalCount = Number(localStorage.globalCount)+1
  updateCount()
  // Add user agent to bottom bar
  message.show("USER AGENT: " + msg.userAgent)
})

// INTERACTION
Array.from(articles.getHTMLElements()).forEach((el, i) => {
  el.addEventListener('mouseover', (e) => {
    if(articles.get(i) != null){
      articles.get(i).toggleAnim()
    }
  })

  el.addEventListener('click', (e) => {    
    if(chrome){
      chrome.runtime.sendMessage(extensionId, {type: "open"},
        (response) => {
          console.log(response)
        });
    }
    const w = Math.randomRange(600,800)
    const h = Math.randomRange(600,800)
    const top = Math.randomRange(0, screen.height-h)
    const left = Math.randomRange(0, screen.width-w)
    localStorage.globalCount = Number(localStorage.globalCount)-100
    updateCount()
    window.open('/news', `_blank`, `height=${h},width=${w},top=${top},left=${left}`)
  })
})

const socketMouse = (msg) => {
  socketOut.emit(msg)
}

// MOVEMENT
const mouseStarted = () => {  
  if(articles.getUserControl() == false){
    if(pageVisible.visible && socketOut) {
      socketOut.emit('mouse-event', 'start')
    }
    // console.log("mouse started", articles.getUserControl())
  }
  if(pageVisible.visible === true) articles.setUserControl(true)  
}

const mouseStopped = () => {
  if(articles.getUserControl() == true){
    if(socketOut) {
      socketOut.emit('mouse-event', 'stop')
    } 
    // console.log("mouse stopped", articles.getUserControl())
  }
  if(pageVisible.visible === true) articles.setUserControl(false)
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

// articles.setUserControl(true)
// articles.play()
const movement = new Movement(5000, mouseStopped, mouseStarted, ()=>{});
grid.pulse()
