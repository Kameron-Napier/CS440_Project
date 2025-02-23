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

// Database connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306
});

// JWT Authentication Middleware
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

// Connect to database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database');
});

// Registration endpoint
app.post('/register',
  body('username')
    .trim()
    .escape()
    .isLength({ min: 3, max: 20 })
    .withMessage('Username must be 3-20 characters'),
  body('password')
    .trim()
    .escape()
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0
    })
    .withMessage('Password must contain 8+ chars with 1 uppercase and 1 number'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { username, password } = req.body;
    const saltRounds = 10;

    try {
      const [existing] = await new Promise((resolve, reject) => {
        connection.query(
          'SELECT * FROM Login WHERE username = ?',
          [username],
          (err, results) => err ? reject(err) : resolve(results)
        );
      });

      if (existing) return res.status(409).send('Username already exists');

      const hash = await bcrypt.hash(password, saltRounds);
      await new Promise((resolve, reject) => {
        connection.query(
          'INSERT INTO Login (username, password_hash) VALUES (?, ?)',
          [username, hash],
          (err, results) => err ? reject(err) : resolve(results)
        );
      });

      res.status(201).send('User created successfully');
    } catch (err) {
      console.error('Registration error:', err);
      res.status(500).send('Server error during registration');
    }
});

// Login endpoint
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

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});