const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

const fileSchema = new mongoose.Schema({
  fieldname: { type: String },
  originalname: { type: String },
  encoding: { type: String },
  mimetype: { type: String },
  destination: { type: String },
  filename: { type: String },
  path: { type: String },
  size: { type: Number },
});

const boardSchema = new mongoose.Schema({
  /* 게시글 정보 */
  title: { type: String },
  writer: { type: String },
  date: { type: Date, default: Date.now },
  count: { type: Number, default: 0 },
  subject: { type: Number, default: 0 },
  important: { type: Number },
  /* 게시글 내용*/
  contents: String,
  /* 게시글 파일 */
  fileUp: fileSchema,
});
boardSchema.plugin(autoIncrement.plugin, 'Board');

module.exports = mongoose.model('Board', boardSchema);
