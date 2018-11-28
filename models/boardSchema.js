const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  writer: { type: String, required: true },
  notice: { type: Boolean, required: true, default: true },
  contents: String,
  comments: [
    {
      name: String,
      memo: String,
      date: { type: Date, default: Date.now },
    },
  ],
  count: { type: Number, default: 0 },
  date: { type: Date, default: Date.now, required: true },
  updated: [{ contents: String, date: { type: Date, default: Date.now } }],
});

module.exports = mongoose.model('BoardSchema', boardSchema);
