"use strict";

const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const UserAuthRepo = require("../db/repo");

/**
 * 
 * @param {passport.PassportStatic} passport 
 * @param {UserAuthRepo} repo 
 */
function PassportAuth(passport, repo) {
    passport.use(new LocalStrategy(
        { passReqToCallback: true },
        function (req, username, password, done) {
          req.session.messages = [];
          
          console.log(`FROM passport local strategy callback: ${JSON.stringify(username)},${password}`);
          repo.validatePassword(username, password, (error, result, user) => {
            if(error) {
                console.log(`ValidatePassword returned errror ${error}`);
                return done(null, false, { message: error });
            }

            if(!result) {
                console.log('ValidatePassword returned false result');
                
                return done(null, false, { message: 'Invalid credentials' });
            }

            console.log('ValidatePassword returned');
            return done(null, user);
          });
        }
      ));
      
      passport.serializeUser((user, done) => {
        done(null, { id: user.id, name: user.name });
      });
      
      passport.deserializeUser((user, done) => {
        // Dummy user deserialization
        // done(null, { id: 1, username: 'user' });
        done(null, user);
      });      
}

module.exports = PassportAuth;