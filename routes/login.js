var express = require('express');
var router = express.Router();

/* Login */
router.get('/', (req, res) => {
  if (req.session.user_id != null) res.redirect('/');
  var chk = 0;
  if (req.query.checked == 'fail') chk = 1;

  res.render('login/index', {
    user_id: req.session.user_id,
    checked: chk,
  });
});
router.post('/check', (req, res) => {
  // 모델 정의
  var User = require('../models/user');

  User.findOne({ id: req.body.your_name, pwd: req.body.your_pass }, function(
    err,
    user
  ) {
    if (err) return res.status(500).json({ error: err });
    if (!user) {
      return res.redirect('/login?checked=fail');
    }
    // user exist
    // save session
    if (req.body.remember_me == 'remember') {
      // remember me 체크박스
      req.session.user_id = req.body.your_name;
      req.session.cookie.maxAge = 365 * 24 * 60 * 60 * 1000;
    } else {
      req.session.user_id = req.body.your_name;
    }
    // redirect to main
    res.redirect('/');
  });
});

/* test계정 생성 */
// id: test, pwd: test
router.get('/create', (req, res) => {
  var User = require('../models/user');
  User.findOne({ id: 'test', pwd: 'test' }, function(err, user) {
    if (err) return res.status(500).json({ error: err });
    if (!user) {
      var book = new User();
      book.id = 'test';
      book.pwd = 'test';
      book.save(function(err) {
        if (err) {
          console.error(err);
          res.json({ result: 0 });
          return;
        }
        res.json({ result: 1 });
      });
    }
    return res.redirect('/login');
  });
});

module.exports = router;
