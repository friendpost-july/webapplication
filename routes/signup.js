const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const UserAuthRepo = require('../db/repo');
const UsersApiClient = require('../apiClients/usersApi.js');

const API_USERS_URL = process.env.API_USERS_URL || 'http://localhost:15002';

/**
 * 
 * @param {UserAuthRepo} repo 
 * @returns {express.Router}
 */
function SignUpRoute(repo) {
    const validateAndRegisterUser = [
        // Validation checks
        body('emailid').isEmail().withMessage('Invalid email address'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
        body('password2').custom((value, { req }) => value === req.body.password).withMessage('Passwords do not match'),
        body('name').notEmpty().withMessage('Name cannot be empty'),
        async (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.render('prehome', { pagedata: { signuperrors: errors.array(), input: { emailid: req.body.emailid, name: req.body.name } } });
            }

            const client = new UsersApiClient(API_USERS_URL);
            let result
            try {
                result = await client.createUser(req.body.emailid, req.body.name)
            } catch (error) {
                return res.render('prehome', { pagedata: { signuperrors: [{msg: "Cannot sign up just now. Please try again later."},{ msg: error }], input: { emailid: req.body.emailid, name: req.body.name } } });
            }

            repo.newUser(req.body.emailid, req.body.name, req.body.password, result.id, (error, newuser) => {
                if (error) {
                    const errors = [{ msg: error }];
                    return res.render('prehome', { pagedata: { signuperrors: errors, input: { emailid: req.body.emailid, name: req.body.name } } });
                }
                req.login(newuser, (error) => {
                    if (error) {
                        const errors = [{ msg: error }];
                        return res.render('prehome', { pagedata: { signuperrors: errors, input: { emailid: req.body.emailid, name: req.body.name } } });
                    }
                    res.redirect('/');
                })
            })
        }
    ];

    const router = express.Router();
    router.post('/', validateAndRegisterUser);
    return router;
}

module.exports = SignUpRoute;
