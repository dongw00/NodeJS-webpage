var express = require('express');
var app = express();
//var bodyParser = require("body-parser");
//var session = require('express-session');
//var mongoose    = require('mongoose');

var port = 8080;

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// mongodb 서버 연결
/*
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    console.log('Connected to mongod server')
});

mongoose.connect(
    'mongodb://localhost/mongodb_test:27017',
    { useNewUrlParser: true }
  );

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'anarlyajum',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 // 1hour
    }
}));
*/
app.listen(port, () => console.log('Express server has started on port 8080'));

require('./routes/main')(app); // ./router/main.js를 app에게 전달
app.use(express.static('./public'));
