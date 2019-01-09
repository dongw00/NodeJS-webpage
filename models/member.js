const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
  name: String,
  course: String,
  comment: String,
  image_url: String,
});

module.exports = mongoose.model('member', MemberSchema);
