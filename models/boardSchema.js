const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

const boardSchema = new mongoose.Schema({
  /* 게시글 정보 */
  /* TODO id값 auto_increament! */
  title: { type: String },
  writer: { type: String },
  date: { type: String },
  count: { type: Number, default: 0 },
  subject: { type: Number, default: 0 },
  important: { type: Number },

  /* 게시글 내용*/
  contents: String,
  /* 게시글 파일 */
  fileUp: [String],
});
boardSchema.plugin(autoIncrement.plugin, 'Board');

module.exports = mongoose.model('Board', boardSchema);
