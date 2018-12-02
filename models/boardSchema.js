const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
  /* 게시글 정보 */
  id: Number,
  title: String,
  writer: String,
  date: { type: Date, default: Date.now },
  count: Number,
  boardNum: Number,
  important: Number,

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

module.exports = mongoose.model('BoardContents', boardSchema);
