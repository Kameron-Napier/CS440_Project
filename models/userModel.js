const connection = require('../db');

exports.findByUsername = (username) => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM Login WHERE username = ?', [username], (err, results) => {
            if (err) return reject(err);
            resolve(results[0]);
        });
    });
};

exports.createUser = (username, passwordHash) => {
    return new Promise((resolve, reject) => {
        connection.query(
            'INSERT INTO Login (username, password_hash) VALUES (?, ?)',
            [username, passwordHash],
            (err, results) => err ? reject(err) : resolve(results)
        );
    });
};
