// https://coligo.io/real-time-analytics-with-nodejs-socketio-vuejs/
class Visitors {
  constructor(app){
    // this.io = app.io
    this.visitorData = {}
    
    this.initIO(app.io)
  }

  initIO(io){

    io.on('connection', (socket) => {

      if (socket.handshake.headers.referer.indexOf("/dashboard") > -1) {
          // if someone visits '/dashboard' send them the computed visitor data
          io.emit('updated-stats', this.computeStats())
      }
      
      // a user has visited our page - add them to the visitorData object
      socket.on('visitor-data', (data) => {
        this.visitorData[socket.id] = data;
        io.emit('updated-stats', this.computeStats())
        // console.log(this.visitorData)
      })
    
      socket.on('disconnect', () => {
        // a user has left our page - remove them from the this.visitorData object
        delete this.visitorData[socket.id];
        io.emit('updated-stats', this.computeStats())
      })
    })

  }

  // get the total number of users on each page of our site
  pages(){
    // sample data in pageCounts object:
    // { "/": 13, "/about": 5 }
    var pageCounts = {};
    for (var key in this.visitorData) {
      var page = this.visitorData[key].page;
      if (page in pageCounts) {
        pageCounts[page]++;
      } else {
        pageCounts[page] = 1;
      }
    }
    return pageCounts;
  }

  referrers(){
    // sample data in referrerCounts object:
    // { "http://twitter.com/": 3, "http://stackoverflow.com/": 6 }
    var referrerCounts = {};
    // console.log(this)
    for (var key in this.visitorData) {
      var referringSite = this.visitorData[key].referringSite || '(direct)';
      if (referringSite in referrerCounts) {
        referrerCounts[referringSite]++;
      } else {
        referrerCounts[referringSite] = 1;
      }
    }
    return referrerCounts;
  }

  activeUsers(){
    return Object.keys(this.visitorData).length;
  }

  computeStats(){
    // console.log('referrers', this.referrers())
    return {
      pages : this.pages(),
      referrers: this.referrers(),
      activeUsers : this.activeUsers()
    }
  }
}

module.exports = Visitors





/*
// get the total number of users per referring site
const referrers = () => {
  // sample data in referrerCounts object:
  // { "http://twitter.com/": 3, "http://stackoverflow.com/": 6 }
  var referrerCounts = {};
  for (var key in visitorData) {
    var referringSite = visitorData[key].referringSite || '(direct)';
    if (referringSite in referrerCounts) {
      referrerCounts[referringSite]++;
    } else {
      referrerCounts[referringSite] = 1;
    }
  }
  return referrerCounts;
}

// get the total active users on our site
const activeUsers = () => {
  return Object.keys(visitorData).length;
}

// wrapper function to compute the stats and return a object with the updated stats
module.exports = () => {
  return {
    pages : pages(),
    referrers: referrers(),
    activeUsers : activeUsers()
  }
}
*/
