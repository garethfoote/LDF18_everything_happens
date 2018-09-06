require("dotenv").config()
const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const sassMiddleware = require('node-sass-middleware')
const exphbs = require('express-handlebars')
const _ = require('lodash')
const httpAuth = require('http-auth');

const Persist = require('./utils/persist');
const Visitors = require('./utils/visitors')

const app = express()
const io  = app.io = require( "socket.io" )()
_.extend(app.locals, require('./config'))

const persist = new Persist(app)
const visitors = new Visitors(app)

const userAgentRouter = require('./routes/userAgent')(persist)
const startRouter = require('./routes/start')
const newsRouter = require('./routes/news')
const dashRouter = require('./routes/dashboard')

// Configure request persist
var requestPersist = function (req, res, next) {
  persist.visit(req)
  next()
}

// Configure basic auth
const basic = httpAuth.basic({
  realm: 'Admin'
}, function(username, password, callback) {
  callback(username == process.env.ADMIN_UN && password == process.env.ADMIN_PW);
});
var authMiddleware = httpAuth.connect(basic);

const hbs = exphbs.create({
  layoutsDir: 'views/layouts/',
  defaultLayout: 'main',
  extname: '.hbs',
  helpers: require('./utils/handlebars.js')
})

// view engine setup
app.engine('.hbs', hbs.engine)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', '.hbs')
app.disable('view cache')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/exhibit', startRouter)
app.use('/news', requestPersist, newsRouter)
app.use('/dashboard', authMiddleware, dashRouter)
app.use('/useragents', authMiddleware, userAgentRouter)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404))
})

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
});

module.exports = app
