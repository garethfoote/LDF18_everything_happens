var fs = require('fs')
var readline = require('readline')
var stream = require('stream')

class LineReader {
    
    constructor(file) {
        this.file = file
        this.maxLines = 50
        this.init()
    }

    init(){
        const instream = fs.createReadStream(this.file)
        const outstream = new stream
        this.rl = readline.createInterface(instream, outstream)
        this.rl.pause()
    }
  
    next() {
        return new Promise((resolve, reject) => {

            let data = []
            let currentLine = 0

            this.rl.resume()

            this.rl.on('line', (line) => {
                if(currentLine >= 50){
                    this.rl.pause()
                } else {
                    data.push(line)
                    currentLine++
                    // console.log(currentLine)
                }
            });
            
            this.rl.on('close', () => {
                resolve(data)
                // reset.
                this.init()             
            });
            
            this.rl.on('pause', () => {
                resolve(data)             
            })
        })
    }
}

module.exports = LineReader