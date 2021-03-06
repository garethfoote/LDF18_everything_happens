const mongoose = require('mongoose');

var visitorSchema = new mongoose.Schema({
  userAgent: String,
  ip: String
}, { timestamps: { createdAt: 'createdAt' }})
var Visitor = mongoose.model('Visitor', visitorSchema)

var headlineSchema = new mongoose.Schema({
  headline: String,
}, { timestamps: { createdAt: 'createdAt' }})
var Headline = mongoose.model('Headline', headlineSchema)


let blacklist = (!process.env.IP_BLACKLIST) ? [] : process.env.IP_BLACKLIST.trim().split(',')

class Persist {

  constructor(app){    
    const lccBlacklist = this.blacklistLCC()
    blacklist = [...lccBlacklist, ...blacklist]

    this.connect()
    this.io = app.io
    this.initIO()
    console.log("Blacklisted IPs: ", blacklist.length)
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

    const options = {
      useNewUrlParser: true,
      // server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
      // replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }
    };
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
      setTimeout(()=>{
        this.io.emit('visitor', {
          userAgent : headers['user-agent']
        })
      }, 500)
    })
  }

  blacklistLCC(){
    const lccBlacklist = []
    for(let i = 0; i < 255; i++){
      blacklist.push(`195.194.24.${i}`)
    }

    return lccBlacklist
  }

  async getHeadlines(t){
    let total = t || 50
    const headlines = await Headline.aggregate([{
      $sample: { size: total },
    }, {
      $group: {
        _id: "$_id",
        document: { $push: "$$ROOT" }
      }
    }, {
      $limit: total
    }, {
      $unwind: "$document"
    }]).exec()

    return headlines
  }

  async getAll(){
    
    const filter = {}
    filter.ip = { $not: { $in: blacklist } }

    const visits = await Visitor.find(filter, (err, items) => {
      if (err) return console.error(err);
    }).limit(50).exec()

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
