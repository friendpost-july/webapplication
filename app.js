"use strict";

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const UserAuthRepo = require('./db/repo');
const PassportAuth = require('./auth/passportauth');

// database
const DB_SERVER = process.env.DB_SERVER || 'localhost';
const DB_PORT = process.env.DB_PORT || 23306;
const DB_USER = process.env.DB_USER || 'dbuser';
const DB_PASSWORD = process.env.DB_PASSWORD || 'dbsomething';
const DB_DATABASE = process.env.DB_DATABASE || 'UserAuthDB';

const repo = UserAuthRepo(DB_SERVER, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE);

repo.ensuredb((error) => {
  if (error) {
    console.log('Could not connect to database: ' + error);
    process.exit(3);
  }
});

const app = express();
// Set view engine
app.set('view engine', 'ejs');

// Middleware setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Set up passport-based authentication
PassportAuth(passport, repo);

// Static serving
app.use(express.static('static'));

// Routes
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const signUpRouter = require('./routes/signup');
const apiRouter = require('./routes/api.js');

app.use('/', indexRouter);
app.use('/auth', authRouter(repo));
app.use('/signup', signUpRouter(repo));
app.use('/api', apiRouter);

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
