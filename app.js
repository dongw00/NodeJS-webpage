const express = require('express');
const app = express();
const compression = require('compression');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const logger = require('morgan');
const helmet = require('helmet');

/* Router */
const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const boardRouter = require('./routes/board');

const port = 8080;

/* Connect mongodb server */
mongoose.connect(
  'mongodb://localhost/KAU',
  { useNewUrlParser: true }
);

const db = mongoose.connection;
db.on('error', console.error);
db.once('open', () => console.log('Connected to mongod server'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(compression()); // gzip encoding
app.use(helmet()); // protect header attack
app.use(logger('dev'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => console.log('Express server has started on port 8080'));

/* Session */
app.use(
  session({
    secret: 'anarlyajum',
    resave: true,
    saveUninitialized: false,
  })
);

/* router */
app.use('/', indexRouter);
app.use('/board', boardRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
