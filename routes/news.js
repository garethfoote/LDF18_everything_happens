const express = require('express')
const router = express.Router()
const glob = require('glob')

const LineReader = require('../data/LineReader.js')
// const headlines = new LineReader('data/headlines/headline_data.csv', true);
const images = []

// EXAMPLE: Setting layout for this whole route.
// https://stackoverflow.com/questions/26871522/how-to-change-default-layout-in-express-using-handlebars
// router.all('/*', function (req, res, next) {
//   req.app.locals.layout = 'admin'; // set your layout here
//   next(); // pass control to the next handler
// });

glob("data/images/images_*.csv", {}, (er, files) => {
  files.forEach((file) => {
    var lineReader = require('readline').createInterface({
      input: require('fs').createReadStream(file)
    })
    lineReader.on('line', (line) => {
      images.push(line)
    })
  })
})

module.exports = (persist) => {

  router.get('/', (req, res, next) => {
    Promise.all([persist.getHeadlines(), persist.getUserAgents(), ...images]).then(function(values) {
      const hl = values.splice(0, 1).pop();
      const ua = values.splice(0, 1).pop();
      const imgs = [].concat.apply([], values);
      res.render('headlines', { chromeExt : process.env.CHROME_EXT, headlines : hl, images: imgs, userAgents : ua });
    });
  })

  return router
}
