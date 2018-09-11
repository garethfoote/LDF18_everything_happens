const mongoose = require('mongoose');

var visitorSchema = new mongoose.Schema({
  userAgent: String,
  ip: String
}, { timestamps: { createdAt: 'createdAt' }})
var Visitor = mongoose.model('Visitor', visitorSchema)

let blacklist = ["::1", "195.194.24.159"]
blacklist = []

class Persist {

  constructor(app){    
    this.connect()
    this.io = app.io
    this.lastIp = ''
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
    const ip = headers['x-forwarded-for'] || req.connection.remoteAddress
    
    // Ignore.
    if(ip === this.lastIp || blacklist.includes(ip)){
      console.log("ignoring: ", ip)
      return
    }
    
    this.lastIp = ip

    var visit = new Visitor({ 
      userAgent: headers['user-agent'],
      ip : ip
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
    
    const filter = {}
    if(typeof process.env.DEBUG === 'undefined'){
      filter.ip = { $not: { $in: blacklist } }
    }      

    const visits = await Visitor.find(filter, (err, items) => {
      if (err) return console.error(err);
    }).exec()

    return visits
  }

  async getUserAgents(){
    const filter = {}
    if(typeof process.env.DEBUG === 'undefined'){
      filter.ip = { $not: { $in: blacklist } }
    }

    const visits = await Visitor.find(filter, (err, items) => {
      if (err) return console.error(err);
    })
    .limit(50).select('userAgent').exec()
    return visits
  }


}

module.exports = Persist
