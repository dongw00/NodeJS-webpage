const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
require('dotenv').config();

const User = require('../models/user');

/* Login */
router.get('/', (req, res) => {
  if (req.session.user_id != null) res.redirect('/');
  let chk = 0;
  if (req.query.checked == 'fail') chk = 1;

  res.render('login/index', {
    user_id: req.session.user_id,
    checked: chk,
  });
});
router.post('/check', (req, res) => {
  User.findOne({ id: req.body.your_name }, (err, user) => {
    if (err) return res.status(500).json({ error: err });
    else if (!user) return res.redirect('/login?checked=fail');

    bcrypt.compare(req.body.your_pass, user.pwd, (err, result) => {
      if (result) {
        if (req.body.remember_me === 'remember') {
          req.session.user_id = req.body.your_name;
          req.session.cookie.maxAge = 365 * 24 * 60 * 60 * 1000;
        } else req.session.user_id = req.body.your_name;
      } else return res.redirect('/login?checked=fail');
      return res.redirect('/');
    });
  });
});

/* Create Admin account */
router.get('/create', (req, res, next) => {
  User.findOne({ id: 'test', pwd: 'test', admin: true }, (err, user) => {
    if (err) return res.status(500).json({ error: err });
    if (!user) {
      const userData = {
        id: process.env.USER_ID,
        pwd: process.env.USER_PW,
        admin: true,
      };
      User.create(userData, (err, user) => {
        if (err) next(err);
        else return res.redirect('/login');
      });
    }
    return res.redirect('/login');
  });
});

module.exports = router;
