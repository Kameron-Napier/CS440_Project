const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const eventEmitter = require('../events/eventEmitter');
const { USER_EVENTS } = require('../events/eventTypes');
const { query } = require('../db/connection');
require('dotenv').config();

/**
 * Initialize user subscribers
 * Sets up event listeners for user-related events
 */
function initUserSubscribers() {
  // Handle user registration
  eventEmitter.on(USER_EVENTS.REGISTER_REQUEST, async ({ userData, res }) => {
    try {
      const { username, password } = userData;
      const saltRounds = 10;

      // Check if username already exists
      const existingUsers = await query(
        'SELECT * FROM Login WHERE username = ?',
        [username]
      );

      if (existingUsers.length > 0) {
        res.status(409).send('Username already exists');
        eventEmitter.emit(USER_EVENTS.REGISTER_FAILURE, { username, error: 'Username already exists' });
        return;
      }

      // Hash password and create user
      const hash = await bcrypt.hash(password, saltRounds);
      await query(
        'INSERT INTO Login (username, password_hash) VALUES (?, ?)',
        [username, hash]
      );

      res.status(201).send('User created successfully');
      eventEmitter.emit(USER_EVENTS.REGISTER_SUCCESS, { username });
    } catch (err) {
      console.error('Registration error:', err);
      res.status(500).send('Server error during registration');
      eventEmitter.emit(USER_EVENTS.REGISTER_FAILURE, { error: err.message });
    }
  });

  // Handle user login
  eventEmitter.on(USER_EVENTS.LOGIN_REQUEST, async ({ userData, res }) => {
    try {
      const { username, password } = userData;

      // Find user
      const users = await query(
        'SELECT * FROM Login WHERE username = ?',
        [username]
      );

      const user = users[0];
      
      // Check if user exists and password is correct
      if (!user || !await bcrypt.compare(password, user.password_hash)) {
        res.status(401).send('Invalid credentials');
        eventEmitter.emit(USER_EVENTS.LOGIN_FAILURE, { username, error: 'Invalid credentials' });
        return;
      }

      // Generate JWT token
      const token = jwt.sign(
        { username: user.username },
          "aBaLtj/yAnsiBl8uMg4gKXqN3uX7SjVqijF/+JA+5OPJew795XDUKFlcGniIax6v",
        { expiresIn: '1h' }
      );
      
      res.json({ token });
      eventEmitter.emit(USER_EVENTS.LOGIN_SUCCESS, { username });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).send('Server error');
      eventEmitter.emit(USER_EVENTS.LOGIN_FAILURE, { error: err.message });
    }
  });
}

module.exports = {
  initUserSubscribers
};