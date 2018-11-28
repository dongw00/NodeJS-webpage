var express = require('express');
var router = express.Router();

/* 게시판 */
router.get('/', (req, res) => {
  var bardSchema = require('../models/boardSchema');
  res.render('board/index', {
    user_id: req.session.user_id,
  });
});

module.exports = router;
