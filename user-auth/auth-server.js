require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { body, validationResult } = require('express-validator');
const app = express();
const port = 3001;

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: 'user_auth',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5500', // Your frontend origin
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

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
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    const saltRounds = 10;

    try {
      // Check if user exists
      const [existing] = await pool.execute(
        'SELECT * FROM users WHERE username = ?',
        [username]
      );

      if (existing.length > 0) {
        return res.status(409).json({ error: 'Username already exists' });
      }

      // Hash password
      const hash = await bcrypt.hash(password, saltRounds);

      // Create new user
      const [result] = await pool.execute(
        'INSERT INTO users (username, password_hash) VALUES (?, ?)',
        [username, hash]
      );

      // Generate JWT
      const token = jwt.sign(
        { user_id: result.insertId, username },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.status(201).json({ 
        message: 'User created successfully',
        token 
      });

    } catch (err) {
      console.error('Registration error:', err);
      res.status(500).json({ error: 'Server error during registration' });
    }
});

// Login endpoint
app.post('/login',
  body('username').trim().escape(),
  body('password').trim().escape(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
      // Get user from database
      const [users] = await pool.execute(
        'SELECT * FROM users WHERE username = ?',
        [username]
      );

      if (users.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const user = users[0];

      // Compare passwords
      const passwordMatch = await bcrypt.compare(password, user.password_hash);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate JWT
      const token = jwt.sign(
        { user_id: user.user_id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.json({ 
        message: 'Login successful',
        token 
      });

    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ error: 'Server error during login' });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Start server
app.listen(port, () => {
  console.log(`User Auth Service running on port ${port}`);
});