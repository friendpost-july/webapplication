"use strict";

const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const passport = require('passport');

function UserAuthRepo(host, port, user, password, database) {
    if (!this) {
        return new UserAuthRepo(host, port, user, password, database)
    }

    this.db = mysql.createConnection({
        host: host,
        port: port,
        user: user,
        password: password,
        database: database
    });
}

UserAuthRepo.prototype.ensuredb = function (callback) {
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS Users (
                                id INT AUTO_INCREMENT PRIMARY KEY,
                                emailid VARCHAR(255) NOT NULL,
                                name VARCHAR(255) NOT NULL,
                                passwordhash VARCHAR(255) NOT NULL,
                                usersserviceid VARCHAR(255) NOT NULL,
                                UNIQUE(emailid)
    )
    `;
    this.db.query(createTableQuery, (err, result) => {
        if (err) {
            callback(err)
        } else {
            callback(null)
        }
    })
}

/**
 * 
 * @param {string} emailId 
 * @param {string} password 
 * @param {{(error:any, result:boolean, user:any)=> void}} callback 
 */
UserAuthRepo.prototype.validatePassword = function (emailId, password, callback) {
    const query = 'SELECT id, emailid, name, passwordhash, usersserviceid FROM Users WHERE emailid = ?';
    this.db.query(query, [emailId], (err, results) => {
        if (err) {
            return callback(err, null);
        }

        if (results.length < 1) {
            return callback('email id or password is invalid');
        }

        const user = results[0];
        bcrypt.compare(password, user.passwordhash, (err, result) => {
            if (err) {
                callback(err, null, null);
            } else {
                callback(null, result, result ? { id: user.usersserviceid, emailid: emailId, name: user.name } : null);
            }
        });
    });
}

/**
 * 
 * @param {string} emailId 
 * @param {string} username 
 * @param {string} password
 * @param {string} usersserviceid
 * @param {UserAuthRepo~userCallback} callback 
 */
UserAuthRepo.prototype.newUser = function (emailId, username, password, usersserviceid, callback) {
    const db = this.db;
    const saltRounds = 10;

    bcrypt.hash(password, saltRounds, function (err, hash) {
        const query = `INSERT INTO Users (emailid, name, passwordhash, usersserviceid) VALUES (?, ?, ?, ?)`;
        db.query(query, [emailId, username, hash, usersserviceid], (err, result) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, { id: result.usersserviceid, emailid: emailId, name: username }); // Return the inserted ID
            }
        });
    });
}

// // Insert a new user
// User.prototype.insert = function (data, callback) {
//     const query = `INSERT INTO ${this.tableName} (emailid, name, password) VALUES (?, ?, ?)`;
//     this.mysql.query(query, [data.emailid, data.name, data.password], (err, result) => {
//         if (err) {
//             callback(err, null);
//         } else {
//             callback(null, result.insertId); // Return the inserted ID
//         }
//     });
// };

// // Update an existing user by ID
// User.prototype.update = function (id, data, callback) {
//     const query = `UPDATE ${this.tableName} SET emailid = ?, name = ?, password = ? WHERE id = ?`;
//     this.mysql.query(query, [data.emailid, data.name, data.password, id], (err, result) => {
//         if (err) {
//             callback(err, null);
//         } else {
//             callback(null, result.affectedRows); // Number of rows affected
//         }
//     });
// };

// // Delete a user by ID
// User.prototype.delete = function (id, callback) {
//     const query = `DELETE FROM ${this.tableName} WHERE id = ?`;
//     this.mysql.query(query, [id], (err, result) => {
//         if (err) {
//             callback(err, null);
//         } else {
//             callback(null, result.affectedRows); // Number of rows affected
//         }
//     });
// };

// // Query users based on criteria (optional filters)
// User.prototype.query = function (filters, callback) {
//     let query = `SELECT * FROM ${this.tableName}`;
//     if (filters) {
//         const conditions = [];
//         Object.keys(filters).forEach(key => {
//             conditions.push(`${key} = ?`);
//         });
//         query += ` WHERE ${conditions.join(' AND ')}`;
//     }
//     this.mysql.query(query, filters ? Object.values(filters) : [], (err, results) => {
//         if (err) {
//             callback(err, null);
//         } else {
//             callback(null, results); // Array of user objects
//         }
//     });
// };

module.exports = UserAuthRepo;

