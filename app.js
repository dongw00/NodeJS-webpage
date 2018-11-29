var express = require('express');
var app = express();
var compression = require('compression');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var logger = require('morgan');
var helmet = require('helmet');

var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var logoutRouter = require('./routes/logout');
var boardRouter = require('./routes/board');

var port = 8080;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(compression()); // gzip encoding
app.use(helmet()); // protect header attack
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => console.log('Express server has started on port 8080'));

/* Session */
app.use(
  session({
    secret: 'anarlyajum',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60,
    },
  })
);

/* router */
app.use('/', indexRouter);
app.use('/board', boardRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);

/* Connect mongodb server */
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function() {
  console.log('Connected to mongod server');
});

mongoose.connect(
  'mongodb://localhost/mongodb_test:27017',
  { useNewUrlParser: true }
);

module.exports = app;
