const mongoose = require('mongoose');

var visitorSchema = new mongoose.Schema({
  userAgent: String,
  ip: String
}, { timestamps: { createdAt: 'createdAt' }})
var Visitor = mongoose.model('Visitor', visitorSchema)

class Persist {

  constructor(app){    
    this.connect()
    this.io = app.io
    this.initIO()
  }

  initIO(){
    const io = this.io
    return new Promise((resolve, reject) => {
      io.on('connection', (socket) => {
        resolve(io) 
      })

      io.on('error', (socket) => {
        reject("io not connected") 
      })
    })
  }
  
  connect(){
    const dbName = 'admin'
    const url = `mongodb://localhost:${process.env.MONGO_PORT}/${dbName}`

    const options = { useNewUrlParser: true }
    if(typeof process.env.DEBUG === 'undefined') {
      options.auth = {
        user : process.env.MONGO_UN,
        password : process.env.MONGO_PW
      }
    }
    mongoose.connect(url, options);

    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
      // we're connected!
      console.log("Connected successfully to server")
    });
  }

  visit(req){
    const headers = req.headers
    var visit = new Visitor({ 
      userAgent: headers['user-agent'],
      ip : headers['x-forwarded-for'] || req.connection.remoteAddress
    })
    visit.save((err, model) => {
      Promise.all([this.initIO(), this.getAll()])
        .then((result) => {
          const [io, visits] = result;
          this.io.emit('visitor', {
            visits: visits.length,
            userAgent : headers['user-agent']
          })
        })
    })
  }

  async getAll(){
    const visits = await Visitor.find(function (err, kittens) {
      if (err) return console.error(err);
    }).exec()

    return visits
  }

}

module.exports = Persist
