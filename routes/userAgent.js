const express = require('express')
const router = express.Router()

module.exports = (persist) => {
  
  router.get('/', (req, res, next) => {
    // res.render('dashboard', { layout: false });
    // console.log(JSON.stringify(persist.getAll()))

    persist.getAll().then((visits) => {
      res.send(JSON.stringify(visits.reverse()))
    })

    // res.send("waiting")
    
  })

  return router
}
