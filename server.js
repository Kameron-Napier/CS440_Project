require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Database connection using environment variables
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

// JWT authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.sendStatus(401);
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

connection.connect((err) => {
  if (err) return console.error('Error connecting:', err);
  console.log('Connected to database');
});

// Login with validation and bcrypt
app.post('/login', 
  body('username').trim().escape(),
  body('password').trim().escape(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { username, password } = req.body;
    
    try {
      const [user] = await new Promise((resolve, reject) => {
        connection.query(
          'SELECT * FROM Login WHERE username = ?',
          [username],
          (err, results) => err ? reject(err) : resolve(results)
        );
      });

      if (!user || !await bcrypt.compare(password, user.password_hash)) {
        return res.status(401).send('Invalid credentials');
      }

      const token = jwt.sign(
        { username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      
      res.json({ token });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).send('Server error');
    }
});

// Protected routes
app.get('/events', authenticateToken, (req, res) => {
  connection.query('SELECT * FROM events_schedule', (err, results) => {
    if (err) return res.status(500).send('Database error');
    res.json(results);
  });
});

app.post('/events', 
  authenticateToken,
  body('event_name').trim().escape().isLength({ max: 35 }),
  body('event_day').isIn(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']),
  body('event_start_time').isTime(),
  body('event_end_time').isTime(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const event = req.body;
    connection.query(
      'INSERT INTO events_schedule SET ?',
      event,
      (err) => {
        if (err) return res.status(500).send('Database error');
        res.status(201).send('Event added');
      }
    );
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});