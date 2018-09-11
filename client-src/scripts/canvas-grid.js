"use strict"
const eventify = require("./event-emitter")
const Resize = require("./resize")
const Utils = require("./utils")

class CanvasGrid {
    constructor(canvas) {
        eventify(this)

        this.gridSpace = 16
        this.canvas = canvas

        this.currentAnimSize = 1;
        this.animDir = 1;

        this.pixelRatio = window.devicePixelRatio || 1
        this.ctx = canvas.getContext('2d')

        this.size()
        this.draw()

        Resize.add(() => {
            this.size()
            this.draw()
        })

        this.easedX = 0
        this.easedY = 0
        this.xPos = 0
        this.yPos = 0
        
        // window.addEventListener('mousemove', Utils.throttle(this.moveHandler, 200))
    }

    moveHandler(mouseX, mouseY){        
        const nextX = Math.round(mouseX/this.gridSpace)
        const nextY = Math.round(mouseY/this.gridSpace)

        if(nextX !== this.xPos || nextY !== this.yPos) {
          this.emit("mouse-move")
        }

        this.xPos = nextX
        this.yPos = nextY
    }

    size() {
        this.width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
        this.height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)

        this.canvas.width = this.width * this.pixelRatio;
        this.canvas.height = this.height * this.pixelRatio;

        this.canvas.style.width = `${this.width}px`;
        this.canvas.style.height = `${this.height}px`;

        this.ctx.scale(this.pixelRatio, this.pixelRatio);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

        this.ctx.fillStyle = "rgba(0, 0, 255, 0.5)";
        for (let x = this.gridSpace; x < this.width; x = x + this.gridSpace) {
            for (let y = this.gridSpace; y < this.height; y = y + this.gridSpace) {
                this.ctx.beginPath();
                // this.ctx.arc(x, y, 1, 0, 2 * Math.PI, true);
                this.ctx.ellipse(x, y, 1, 1, 45 * Math.PI/180, 0, 2 * Math.PI);
                this.ctx.fill();
            }
        }
    }

    randomPulseLocation(){

        if(this.yPos%2 == 0){
            if(Math.random() > 0.5){
                this.xPos++
            } else {
                this.xPos--
            }
        }
        
        if(this.xPos%2 == 1){
            if(Math.random() > 0.5){
                this.yPos++
            } else {
                this.yPos--
            }
        }
        // console.log(this.xPos, this.yPos)
    }

    pulse(){
        this.draw()

        const easing = 0.1

        // const dx = this.xPos - this.easedX
        // const dy = this.yPos - this.easedY

        // this.easedX += dx * easing
        // this.easedY += dy * easing

        // const easedGridX = Math.round(this.easedX/this.gridSpace)
        // const easedGridY = Math.round(this.easedY/this.gridSpace)

        const x = this.xPos*this.gridSpace
        const y = this.yPos*this.gridSpace

        this.ctx.beginPath();
        // this.ctx.arc(x, y, 1, 0, 2 * Math.PI, true)
        this.ctx.ellipse(x, y, this.currentAnimSize, this.currentAnimSize, 45 * Math.PI/180, 0, 2 * Math.PI)
        this.ctx.fill()

        if(this.currentAnimSize >= 20 || this.currentAnimSize <= 0){
            this.animDir *= -1
        } 

        this.currentAnimSize += this.animDir
        requestAnimationFrame(this.pulse.bind(this))
    }

}

module.exports = CanvasGrid
