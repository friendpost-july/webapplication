const express = require('express');
//const router = express.Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const UserAuthRepo = require('../db/repo');

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
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.render('prehome', { pagedata: { signuperrors: errors.array(), input: { emailid: req.body.emailid, name: req.body.name } } });
            }

            repo.newUser(req.body.emailid, req.body.name, req.body.password, (error, newuser) => {
                if (error) {
                    const errors = [{ msg: error }];
                    return res.render('prehome', { pagedata: { signuperrors: errors, input: { emailid: req.body.emailid, name: req.body.name } } });
                }
                req.login(newuser,(error) => {
                    if(error) {
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
// Middleware for validation and user registration
// const validateAndRegisterUser = [
//     // Validation checks
//     body('emailid').isEmail().withMessage('Invalid email address'),
//     body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
//     body('password2').custom((value, { req }) => value === req.body.password).withMessage('Passwords do not match'),
//     body('name').notEmpty().withMessage('Name cannot be empty'),
//     // body('dob').custom((value) => {
//     //     const dob = new Date(value);
//     //     const age = new Date().getFullYear() - dob.getFullYear();
//     //     if (age < 10) {
//     //         throw new Error('Date of birth must be at least 10 years before the current date');
//     //     }
//     //     return true;
//     // }),
//     (req, res) => {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.render('prehome', { pagedata: { signuperrors: errors.array(), input: { emailid: req.body.emailid, name: req.body.name } } });
//         }

//         res.status(200).send("sab changa si")
//     }
//     // async (req, res, next) => {
//     //   const errors = validationResult(req);
//     //   if (!errors.isEmpty()) {
//     //     return res.status(400).json({ errors: errors.array() });
//     //   }

//     //   const { emailid, password, name, dob } = req.body;

//     //   try {
//     //     // Check if email already exists
//     //     const [rows] = await db.promise().query('SELECT emailid FROM Users WHERE emailid = ?', [emailid]);
//     //     if (rows.length > 0) {
//     //       return res.status(400).json({ errors: [{ msg: 'Email already exists' }] });
//     //     }

//     //     // Hash the password
//     //     const hashedPassword = await bcrypt.hash(password, 10);

//     //     // Insert the new user
//     //     await db.promise().query('INSERT INTO Users (emailid, name, password, dob) VALUES (?, ?, ?, ?)', [emailid, name, hashedPassword, dob]);

//     //     // Redirect to login page
//     //     res.redirect('/login');
//     //   } catch (error) {
//     //     console.error(error);
//     //     res.status(500).json({ errors: [{ msg: 'Server error' }] });
//     //   }
//     // }
// ];

// // Route to register user
// //app.post('/register', validateAndRegisterUser);


// router.post('/', validateAndRegisterUser);


// module.exports = router;

