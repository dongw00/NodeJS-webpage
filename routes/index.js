const express = require('express');
const router = express.Router();

/* Homepage */
router.get('/', (req, res) => {
  let Member = require('../models/member');
  Member.find().lean().exec(function(err, docs) {
    res.render('home/index',
      { user_id: req.session.user_id,
        members: docs}
    );
  });
});

/* 연구실 소개 */
router.get('/professor', (req, res) => {
  res.render('professor/index', { user_id: req.session.user_id });
});

/* members */
router.get('/members', (req, res) => {
  let Member = require('../models/member');
  Member.find({"course":"박사"}).lean().exec(function(err, doctorDocs) {
    Member.find({"course":"석사"}).lean().exec(function(err, masterDocs) {
      res.render('members/index',
        { user_id: req.session.user_id,
          doctors: doctorDocs,
          masters: masterDocs}
      );
    });
  });
});

/* researches */
router.get('/researches', (req, res) => {
  res.render('researches/index', { user_id: req.session.user_id });
});

module.exports = router;
