// schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    id: String,
    pwd: String
});

// 모듈화
module.exports = mongoose.model('user', userSchema);