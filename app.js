const express = require("express");
const app = express();
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect(
  "mongodb://localhost/notice",
  {
    useNewUrlParser: true
  }
);

var db = mongoose.connection;
db.on("error", console.error);
db.once("open", function() {
  // CONNECTED TO MONGODB SERVER
  console.log("Connected to mongod server");
});

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.listen(3000, () => console.log("Express server has started on port 3000"));

require("./routes/main")(app); // ./router/main.js를 app에게 전달
app.use(express.static("./public"));
