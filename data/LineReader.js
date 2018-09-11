var fs = require('fs')
var readline = require('readline')
var stream = require('stream')

let _debug = false
class LineReader {
    
    constructor(file, doDebug) {
      _debug = doDebug || false
      this.file = file
      this.maxLines = 50
      this.init()
    }

    setDebug(doDebug){
      _debug = doDebug
    }

    init(){
      const instream = fs.createReadStream(this.file)
      const outstream = new stream
      this.rl = readline.createInterface(instream, outstream)
      this.rl.pause()
      if(_debug)
      console.log('init')
    }
  
    next() {
      return new Promise((resolve, reject) => {
        let data = []
        let currentLine = 0
        let pauseLine = 0

        this.rl.resume()

        this.rl.on('line', (line) => {
          if(currentLine >= 50){
            this.rl.pause()
            if(_debug) console.log('pause', pauseLine)
            pauseLine++
          } else {
            data.push(line)
            currentLine++
          }
        });
        
        this.rl.on('close', () => {
          if(_debug) console.log('close')
          resolve(data)
          // reset.
          this.init()             
        });
        
        this.rl.on('pause', () => {
          if(_debug) console.log('pause')
          resolve(data)             
        })
    })
  }
}

module.exports = LineReader
