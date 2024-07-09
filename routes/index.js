const express = require('express');
const router = express.Router();
const path = require('path');

/** @type {import("express").RequestHandler} */
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/auth/login')
}

router.get('/', ensureAuthenticated, (req, res) => {
  res.render('home', { pagedata: { user: req.user } });
});

module.exports = router;
