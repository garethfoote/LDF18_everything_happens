var express = require('express')
var router = express.Router()

var Clickbait = require('../data/clickbait_data.js')
const clickbait = new Clickbait('data/clickbait_data.csv');

router.get('/', (req, res, next) => {
  clickbait.next().then((headlines) => {
    res.render('headlines', { headlines : headlines });
  })
})

module.exports = router;
