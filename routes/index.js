const express = require('express');
const router = express.Router();
const path = require('path');


/** @type {import("express").RequestHandler} */
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/auth/login');
}

router.get('/', ensureAuthenticated, (req, res) => {
  res.render('home', { pagedata: { user: req.user } });
});

router.get('/profile', ensureAuthenticated, (req, res) => {
  const id = req.query.id;
  const pageObject = { pagedata: { user: req.user } };
  
  if(id && id !== req.user.id) {
    pageObject.pagedata.otheruser = true;
    pageObject.pagedata.profile = { id: id };
  }
  res.render('profile', pageObject);
});

module.exports = router;
