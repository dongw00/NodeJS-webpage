var express = require('express');
var router = express.Router();

/* 게시판 */
router.get('/board', (req, res) => {
  res.render('notice/index', {
    user_id: req.session.user_id,
  });
});

module.exports = router;
