require("./styles/main.scss");
const Utils = require("./scripts/utils.js")
const CanvasGrid = require("./scripts/canvas-grid")
const CanvasImage = require("./scripts/canvas-image")
const Movement = require("./scripts/movement")
const Articles = require("./scripts/articles")
const PageVisible = require("./scripts/page-visibility")
const Message = require("./scripts/message")
const Sidebar = require("./scripts/sidebar")
const Socket = require("./scripts/sockets")
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
// MESSAGES
const message = new Message(document.querySelector('.js-message'))
const sidebar = new Sidebar(document.querySelector('.js-sidebar'))
sidebar.show()
// SOCKETS
const socket = new Socket()
socket.updateCount()

articles.on('article-complete', ()=>{
  localStorage.globalCount = Number(localStorage.globalCount)+1
  socket.updateCount()
  if(socket.canOutbound === true) {
    socket.send('user-event', 'article-complete')
  } 
})

grid.on('mouse-move', () => {
  localStorage.globalCount = Number(localStorage.globalCount)-1
  socket.updateCount()
})

socket.on('new-user-agent', (msg) => {
  // Add user agent to sidebar
  sidebar.add(msg)
  // Add user agent to bottom bar
  message.show("USER AGENT: " + msg)
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
    socket.updateCount()
    window.open('/news', `_blank`, `height=${h},width=${w},top=${top},left=${left}`)
    socket.send('user-event', 'page-opened')
  })
})

// MOVEMENT
const mouseStarted = () => {  
  if(articles.getUserControl() == false){
    if(pageVisible.visible && socket.canOutbound) {
      socket.send('user-event', 'start')
    }
    // console.log("mouse started", articles.getUserControl())
  }
  if(pageVisible.visible === true) articles.setUserControl(true)  
}

const mouseStopped = () => {
  if(articles.getUserControl() == true){
    if(socket.canOutbound === true) {
      // socket.send('user-event', 'stop')
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
const movement = new Movement(10000, mouseStopped, mouseStarted, ()=>{});
grid.pulse()
