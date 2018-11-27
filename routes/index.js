var express = require('express');
var router = express.Router();

/* Homepage */
router.get('/', (req, res) => {
  res.render('home/index', { user_id: req.session.user_id });
});

/* 연구실 소개 */
router.get('/professor', (req, res) => {
  res.render('professor/index', { user_id: req.session.user_id });
});

/* members */
router.get('/members', (req, res) => {
  res.render('members/index', { user_id: req.session.user_id });
});

/* researches */
router.get('/researches', (req, res) => {
  res.render('researches/index', { user_id: req.session.user_id });
});

module.exports = router;
