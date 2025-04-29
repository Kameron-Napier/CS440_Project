const connection = require('../db');

exports.getAllEvents = () => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM events_schedule', (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

exports.addEvent = (event) => {
    return new Promise((resolve, reject) => {
        connection.query('INSERT INTO events_schedule SET ?', event, (err) => {
            if (err) return reject(err);
            resolve();
        });
    });
};
