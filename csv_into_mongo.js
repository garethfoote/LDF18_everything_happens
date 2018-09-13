require("dotenv").config()

const mongoose = require('mongoose');

var headlineSchema = new mongoose.Schema({
  headline: String,
}, { timestamps: { createdAt: 'createdAt' }})
var Headline = mongoose.model('Headline', headlineSchema)

class Persist {

  constructor(){    
    this.connect()

    // REMOVE
    // .then(msg=>{
    //   // console.log(msg)
    //   this.clear()
    // })
    // .then((msg)=>{
    //   return this.getAll()
    // }).then((items)=>{console.log(items)})
    
    // ADD
    // .then(msg=>{
    //   console.log(msg)
    //   // return this.getCSV("test")
    //   this.getCSV('./data/headlines/headline_data.csv')
    // })

    // GET ALL
    // .then((msg)=>{
    //   return this.getAll()
    // })
    // .then((items)=>{
    //   console.log(items.length)
    // })


    // GET RANDOM
    .then((msg)=>{
      return this.getRandom(50)
    })
    .then((items)=>{
      console.log(items)
    })
    
  }

  clear(){
    Headline.deleteMany({}, (err) => {
      if (err) return console.error(err);
      console.log('removed')
    })
  }

  getCSV(inputFile){
    var lineReader = require('readline').createInterface({
      input: require('fs').createReadStream(inputFile)
    });
    
    lineReader.on('line', (line) => {
      this.add(line)
    })
  }
  
  connect(){
    const dbName = 'admin'
    const url = `mongodb://localhost:${process.env.MONGO_PORT}/${dbName}`

    const options = {
      useNewUrlParser: true,
      server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
      replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }
    };
    if(typeof process.env.DEBUG === 'undefined') {
      options.auth = {
        user : process.env.MONGO_UN,
        password : process.env.MONGO_PW
      }
    }
    
    return new Promise((resolve, reject)=>{
      mongoose.connect(url, options);
      var db = mongoose.connection;
      db.on('error', console.error.bind(console, 'connection error:'));
      db.once('open', function() {
        // we're connected!
        resolve("Connected successfully to server")
      });
    })
    
  }

  add(hl){
    var headline = new Headline({ 
      headline: hl
    })
    
    return headline.save((err, model) => {
      if(err) console.log(err)
      console.log(model)
    })
  }

  getRandom(total){
    return Headline.aggregate([{
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
  }

  getAll(){
    
    const filter = {}
    return new Promise((resolve, reject)=>{

      Headline.find(filter, (err, items) => {
        if (err) return console.error(err);
        // console.log(items)
        resolve(items)
      }).exec()
    })
    // return headlines
  }
}

new Persist()
