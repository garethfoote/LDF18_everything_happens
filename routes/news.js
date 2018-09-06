const express = require('express')
const router = express.Router()
const glob = require('glob')

const LineReader = require('../data/LineReader.js')
const headlines = new LineReader('data/headlines/headline_data.csv');
const images = []

// EXAMPLE: Setting layout for this whole route.
// https://stackoverflow.com/questions/26871522/how-to-change-default-layout-in-express-using-handlebars
// router.all('/*', function (req, res, next) {
//   req.app.locals.layout = 'admin'; // set your layout here
//   next(); // pass control to the next handler
// });

glob("data/images/images_*.csv", {}, (er, files) => {
  files.forEach((file) => {
    images.push(new LineReader(file).next())
  })
})

router.get('/', (req, res, next) => {
  Promise.all([headlines.next(), ...images]).then(function(values) {
    const hl = values.splice(0, 1).pop();
    const imgs = [].concat.apply([], values);
    // console.log('img', imgs)
    res.render('headlines', { headlines : hl, images: imgs });
  });
})

module.exports = router;
