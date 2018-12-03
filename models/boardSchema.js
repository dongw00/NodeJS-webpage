const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

const boardSchema = new mongoose.Schema({
  /* 게시글 정보 */
  /* TODO id값 auto_increament! */
  id: { type: Number, required: true },
  title: { type: String, required: true },
  writer: { type: String, required: true },
  date: { type: Date, default: Date.now, required: true },
  count: { type: Number, default: 0, required: true },
  subject: { type: Number, default: 0, required: true },
  important: { type: Number, default: 0, required: true },

  /* 게시글 내용*/
  contents: String,
  comments: [
    {
      name: String,
      memo: String,
      date: { type: Date, default: Date.now },
    },
  ],
  /* 게시글 파일 */
  fileUp: [String],
});
boardSchema.plugin(autoIncrement.plugin, 'BoardContents');

module.exports = mongoose.model('BoardContents', boardSchema);
