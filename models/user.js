const mongoose = require('mongoose');

const LoginSchema = new mongoose.Schema({
  id: String,
  pwd: String,
  admin: Boolean,
});

module.exports = mongoose.model('user', LoginSchema);
