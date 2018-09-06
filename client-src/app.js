require("./styles/main.scss");
const Utils = require("./scripts/utils.js")
const CanvasGrid = require("./scripts/canvas-grid")
const CanvasImage = require("./scripts/canvas-image")
const Movement = require("./scripts/movement")
const Articles = require("./scripts/articles")
const PageVisible = require("./scripts/page-visibility")
const Message = require("./scripts/message")

let windows = []; 
if(window.name == ''){
  windows.push(window) // push root window
  window.addEventListener("beforeunload", function (e) {
    var confirmationMessage = "\o/";
    // console.log('hello')
    (e || window.event).returnValue = confirmationMessage; //Gecko + IE
    return confirmationMessage;                            //Webkit, Safari, Chrome
  })
}

let winOpen = window.open
window.open = function() {
  const win = winOpen.apply(this, arguments)
  windows.push(win)
}

window.addEventListener('message', (event) => {
  if(event.data.type !== 'open') return
  console.log(window.name, ' is opening ', windows.length+1, " - ", event.data)
  if(event.data == 'open') {
    window.open('/news', windows.length+1, `height=500,width=${Math.randomRange(700, 800)}`)
  }
})

if(!window.images){
  console.error("No image array available");
}

// ARTICLES
const articles = new Articles(750, [1000, 2500])
// VISIBILITY
// const pageVisible = new PageVisible(articles.play.bind(articles), articles.pause.bind(articles))
const pageVisible = new PageVisible(()=>{}, ()=>{})
// GRID
const grid = new CanvasGrid(document.getElementById("bg"))
// MESSAGE
const message = new Message(document.querySelector('.js-message'))


// SOCKETS
const socketIn = require('socket.io-client')()
const socketOut = require('socket.io-client')('http://localhost:3001', {
  path: '/socket.io'
})

socketIn.on('visitor', function(msg){
  console.log('in -> out: ', msg);
  message.animate("USER AGENT: " + msg.userAgent)
  if(pageVisible.visible && socketOut) socketOut.emit('visitor', msg)
})

// INTERACTION
Array.from(articles.getHTMLElements()).forEach((el, i) => {
  el.addEventListener('mouseover', (e) => {
    if(articles.get(i) != null){
      articles.get(i).toggleAnim()
    }
  })

  el.addEventListener('click', (e) => {    
    console.log(window.name, `next window name = ${windows.length+1}`)
    if(window.name == ''){
      window.open('/news', `${windows.length+1}`, `height=700,width=${Math.randomRange(500,800)}`)
    } else {
      if(!window.opener) window.close()
      window.opener.postMessage({type: "open"}, '*')
    }
  })
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

// articles.setUserControl(true)
// articles.play()
const movement = new Movement(5000, mouseStopped, mouseStarted, ()=>{});
grid.pulse()
