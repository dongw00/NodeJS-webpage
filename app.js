const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const session = require('express-session');
const mongoose    = require('mongoose');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// mongodb 서버 연결
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    console.log('Connected to mongod server')
});

mongoose.connect('mongodb://localhost/mongodb_test')

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

app.listen(3000, () => console.log('Express server has started on port 3000'));

require('./routes/main')(app); // ./router/main.js를 app에게 전달
app.use(express.static('./public'));
