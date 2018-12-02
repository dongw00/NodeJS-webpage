const express = require('express');
const router = express.Router();

/* Logout */
router.get('/', (req, res) => {
  if (req.session.user_id) {
    req.session.destroy(function(err) {
      if (err) {
        console.log(err);
      } else {
        res.redirect('/');
      }
    });
  } else {
    res.redirect('/');
  }
});

module.exports = router;
