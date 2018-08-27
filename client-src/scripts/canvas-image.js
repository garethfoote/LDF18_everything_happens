"use strict"
const Resize = require("./resize")

const config = {
    blocks : 5
}

class CanvasImage {
    constructor(parentEl, url) {

        const existingCanvas = parentEl.querySelector('canvas')
        this.config = config

        this.dx = -0.5
        this.v = Math.min(25, this.config.blocks)
    
        this.canvas = existingCanvas || document.createElement("canvas")
        this.canvas.width = 800
        this.canvas.height = 450

        parentEl.appendChild(this.canvas)

        this.ctx = this.canvas.getContext('2d')
        this.img = new Image()
        
        // turn off image smoothing - this will give the pixelated effect
        this.ctx.mozImageSmoothingEnabled = false
        this.ctx.webkitImageSmoothingEnabled = false
        this.ctx.imageSmoothingEnabled = false
        // wait until image is actually available
        this.img.onload = this.pixelate.bind(this);

        // some image, we are not struck with CORS restrictions as we
        // do not use pixel buffer to pixelate, so any image will do
        this.img.src = url
    }

    pixelate(v) {
        // if in play mode use that value
        const size = this.v * 0.01

        // cache scaled width and height
        const w = this.canvas.width * size
        const h = this.canvas.height * size

        // draw original image to the scaled size
        this.ctx.drawImage(this.img, 0, 0, w, h)

        // then draw that scaled image thumb back to fill canvas
        // As smoothing is off the result will be pixelated
        this.ctx.drawImage(this.canvas, 0, 0, w, h, 0, 0, this.canvas.width, this.canvas.height)
    }

    toggleAnim() {

        // limit blocksize as we don't want to animate tiny blocks
        this.dx *= -1.0 /// "speed"
    
        // toggle play flag set by button "Animate"
        // this.play = !this.play;
    
        // and update button's text
        // animate.value = play ? 'Stop' : 'Animate';
    
        // if in play mode start loop
        this.anim();
    }

    anim(){
        // increase or decrease value
        this.v += this.dx;

        // pixelate image until clear
        this.pixelate(this.v)
        // console.log(this.dx, this.v);

    
        // loop
        if((this.dx < 0 && this.v > 5) || (this.dx > 0 && this.v < 25)) {
            requestAnimationFrame(this.anim.bind(this))
        }
    }

}

module.exports = CanvasImage

// event listeneners for slider and button
// blocks.addEventListener('change', pixelate, false);
// animate.addEventListener('click', toggleAnim, false);
