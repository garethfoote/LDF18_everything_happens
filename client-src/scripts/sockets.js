const eventify = require("./event-emitter.js")
const SocketIO = require('socket.io-client')

class Sockets {
  constructor(){
    eventify(this)

    this.canOutbound = true

    if(this.canOutbound){
      this.socketOut = SocketIO('http://localhost:3001', {
        path: '/socket.io'
      })
    }

    this.socketIn = SocketIO()
    this.socketIn.on('visitor', this.onVisitorRx.bind(this))

    this.quantTimeoutId = -1
    this.currentCount = Number(localStorage.globalCount)

    this.updateCount()
  }

  send(){
    if(this.canOutbound === true){
      // console.log("Send:", ...arguments)
      this.socketOut.emit(...arguments)
    }
  }

  onVisitorRx(msg){
    this.emit("new-user-agent", msg.userAgent)
    // Update global count
    localStorage.globalCount = Number(localStorage.globalCount)+1
    this.updateCount()
  }

  updateCount(){
    clearTimeout(this.quantTimeoutId);
    let delta = Math.abs(this.currentCount - Number(localStorage.globalCount))
    let direction = (this.currentCount > Number(localStorage.globalCount)) ? -1 : 1
    direction = (delta == 0) ? 0 : direction
    if(delta != 0){
      this.currentCount += (Math.min(10, delta)*direction)
      if(this.canOutbound) this.socketOut.emit('visitor', this.currentCount)
      this.quantTimeoutId = setTimeout(this.updateCount.bind(this), 10)
    }
    // } else {
    //   if(!noTimeout) quantTimeoutId = setTimeout(updateCount, Math.randomRange(5000, 10000))
    // }
  }
  
}

module.exports = Sockets
