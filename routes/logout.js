const express = require('express');
const router = express.Router();

/* Logout */
router.get('/', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) return next(err);
      else return res.redirect('/');
    });
  }
});

module.exports = router;
