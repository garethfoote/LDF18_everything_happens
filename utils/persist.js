const mongoose = require('mongoose');

var visitorSchema = new mongoose.Schema({
  userAgent: String,
  ip: String
}, { timestamps: { createdAt: 'createdAt' }})
var Visitor = mongoose.model('Visitor', visitorSchema)

let blacklist = (!process.env.IP_BLACKLIST) ? [] : process.env.IP_BLACKLIST.trim().split(',')

class Persist {

  constructor(app){    
    this.connect()
    this.io = app.io
    this.initIO()
    // console.log("Blacklisted IPs: ", blacklist)
  }

  initIO(){
    const io = this.io
    io.on('connection', (socket) => {
      // console.log("Socket.IO - connected") 
    })
    io.on('error', (socket) => {
      // console.log("Socket.io not connected") 
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
      // console.log("Connected successfully to server")
    });
  }

  visit(req){
    const headers = req.headers
    const ua = headers['user-agent']
    const ip = headers['x-forwarded-for'] || req.connection.remoteAddress
    
    // Ignore.
    if(blacklist.includes(ip)){
      console.log("blacklisted: ", ua)
      return
    }
    
    var visit = new Visitor({ 
      userAgent: headers['user-agent'],
      ip : ip
    })
    
    visit.save((err, model) => {
      this.getAll().then((result) => {
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
    filter.ip = { $not: { $in: blacklist } }

    const visits = await Visitor.find(filter, (err, items) => {
      if (err) return console.error(err);
    }).exec()

    return visits
  }

  async getUserAgents(){

    const filter = {}
    filter.ip = { $not: { $in: blacklist } }

    const visits = await Visitor.find(filter, (err, items) => {
      if (err) return console.error(err);
    })
    .sort('-createdAt').limit(50).select('userAgent').exec()
    return visits
  }
  
}

module.exports = Persist
