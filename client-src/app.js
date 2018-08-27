require("./styles/main.scss");
const Utils = require("./scripts/utils.js")
const CanvasGrid = require("./scripts/canvas-grid")
const CanvasImage = require("./scripts/canvas-image")
const Movement = require("./scripts/movement")

if(!window.images){
    console.error("No image array available");
}

const grid = new CanvasGrid(document.getElementById("bg"))
const imgElements = document.querySelectorAll('.js-pixelate')
const messageEl = document.querySelector('.js-message')
const canvasImages = []

const scrollDuration = 500
let intervalDuration = scrollDuration + Math.randomRange(500, 2500)
let timeoutId = -1
let isForceScrolling = false
let isUserControlled = false

const nextImage = () => {
    let elIndex
    if(isUserControlled === true){
        const firstLastInView = Utils.elementIndexesInView(imgElements)
        elIndex = Math.randomRange(firstLastInView[0], firstLastInView[1])
        intervalDuration = Math.randomRange(500, 1500)
    } else {
        elIndex = Math.floor(Math.random()*imgElements.length)
        intervalDuration = scrollDuration + Math.randomRange(500, 2500)
    }
 
    // Choose random element and image
    const parentEl = imgElements[elIndex]
    const imageUrl = Utils.chooseRandomArray(window.images)
    
    // Scroll to it
    if(isUserControlled === false){
        console.log("user controlled", isUserControlled)
        Utils.scrollToElement(parentEl, scrollDuration)
    }

    // and reveal/pixelate after scroll delay
    setTimeout(() => {
        canvasImages[elIndex] = new CanvasImage(parentEl, imageUrl)
    }, (isUserControlled === false ? scrollDuration : 1))

    // Go again.
    // intervalDuration = nextScrollDuration + Math.randomRange(500, 2500)
    timeoutId = setTimeout(nextImage.bind(this), intervalDuration)
}

Array.from(imgElements).forEach((el, i) => {
    el.addEventListener('mouseover', (e) => {
        if(canvasImages[i] != null){
            canvasImages[i].toggleAnim()
        }
    })
})

const scrollStarted = () => {    
    if(isForceScrolling == false){
    }
}
const mouseStarted = () => {  
    console.log("mouse started", isUserControlled)
    if(isUserControlled == false){
        messageEl.parentNode.classList.add('is-hidden')
        setTimeout(() => {
            messageEl.innerHTML = "You have regained control"
            messageEl.style.animationDelay = '-0.1s'
            messageEl.parentNode.classList.remove('is-hidden')
            setTimeout(() => {
                messageEl.parentNode.classList.add('is-hidden')
            }, 20000)
        }, 500)
    }
    isUserControlled = true
    Utils.scrollStop()  

}
const mouseStopped = () => {
    if(isUserControlled == true){
        messageEl.parentNode.classList.add('is-hidden')
        setTimeout(() => {
            messageEl.innerHTML = "The bots are back"
            messageEl.style.animationDelay = '-0.1s'
            messageEl.parentNode.classList.remove('is-hidden')
            setTimeout(() => {
                messageEl.parentNode.classList.add('is-hidden')
            }, 20000)
        }, 500)
    }
    isUserControlled = false
    messageEl.innerHTML = "You have regained control."
    console.log("mouse stopped", isUserControlled)
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

const initMovement = () => {
    const movement = new Movement(5000, mouseStopped, mouseStarted, scrollStarted);
}

// nextImage()
initMovement()
grid.pulse()
