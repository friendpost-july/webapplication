const express = require('express');
const passport = require('passport');
const UserAuthRepo = require('../db/repo');


/**
 * 
 * @param {UserAuthRepo} repo 
 * @returns {express.Router}
 */
function AuthRoute(repo) {
  const router = express.Router();

  router.post('/login',
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/auth/login',
      failureMessage: true,
      failureFlash: false
    })
  );
  
  router.get('/login', (req, res) => {
    res.render('prehome', { pagedata: { loginerror: req.loginerror, messages: req.session.messages } })
  });
  
  router.get('/logout', (req, res) => {
    req.logout(() => {
      res.redirect('/');
    });
  });

  return router;
}

module.exports = AuthRoute;
