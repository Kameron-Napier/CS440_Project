const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Create a connection to the RDS database
const connection = mysql.createConnection({
  host: 'cs440-db.cdio8ucck53z.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: 'CS440-DB',
  database: 'CS440',
  port: 3306 // Default MySQL port
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

// API to fetch events from events_schedule table
app.get('/events', (req, res) => {
  const query = 'SELECT * FROM events_schedule';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching events:', err);
      res.status(500).send('Error fetching events');
      return;
    }
    res.json(results);
  });
});

// API to add a new event to events_schedule table
app.post('/events', (req, res) => {
    const { event_name, event_day, event_start_time, event_end_time } = req.body;
  
    const query = 'INSERT INTO events_schedule (event_name, event_day, event_start_time, event_end_time) VALUES (?, ?, ?, ?)';
    connection.query(query, [event_name, event_day, event_start_time, event_end_time], (err, results) => {
      if (err) {
        console.error('Error adding event:', err);
        res.status(500).send('Error adding event: ' + err.message);
        return;
      }
      res.status(201).send('Event added successfully');
    });
  });

// API to validate login credentials
app.post('/login', (req, res) => {
  const { username, pass } = req.body;
  const query = 'SELECT * FROM Login WHERE username = ? AND pass = ?';
  connection.query(query, [username, pass], (err, results) => {
    if (err) {
      console.error('Error validating login:', err);
      res.status(500).send('Error validating login');
      return;
    }
    if (results.length > 0) {
      res.status(200).send('Login successful');
    } else {
      res.status(401).send('Invalid credentials');
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});