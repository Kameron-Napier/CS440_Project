require('dotenv').config();
const mysql = require('mysql');
const eventEmitter = require('../events/eventEmitter');
const { DB_EVENTS } = require('../events/eventTypes');

const dbConfig = {
  host: 'localhost',
  user: 'admin',
  password: 'admin',
  database: 'cs440',
  port: process.env.DB_PORT || 3306
};

const connection = mysql.createConnection(dbConfig);

function connectToDatabase() {
  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to database:', err);
      eventEmitter.emit(DB_EVENTS.CONNECT_FAILURE, err);
      return;
    }
    console.log('Connected to database');
    eventEmitter.emit(DB_EVENTS.CONNECT_SUCCESS);
  });
}

function query(sql, params) {
  return new Promise((resolve, reject) => {
    connection.query(sql, params, (err, results) => {
      if (err) {
        eventEmitter.emit(DB_EVENTS.QUERY_FAILURE, { sql, params, error: err });
        reject(err);
        return;
      }
      eventEmitter.emit(DB_EVENTS.QUERY_SUCCESS, { sql, results });
      resolve(results);
    });
  });
}

module.exports = {
  connection,
  connectToDatabase,
  query
};