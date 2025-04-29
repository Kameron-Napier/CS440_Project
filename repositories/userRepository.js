// repositories/userRepository.js - User data access layer
const db = require('../config/database');
const User = require('../models/user');

class UserRepository {
  /**
   * Find a user by username
   * @param {string} username - The username to search for
   * @returns {Promise<User|null>} The user object or null if not found
   */
  async findByUsername(username) {
    try {
      const [rows] = await db.query('SELECT * FROM Login WHERE username = ?', [username]);
      return rows.length > 0 ? new User(rows[0]) : null;
    } catch (error) {
      console.error('Database error in findByUsername:', error);
      throw error;
    }
  }

  /**
   * Create a new user
   * @param {User} user - The user object to create
   * @returns {Promise<boolean>} True if successful
   */
  async create(user) {
    try {
      await db.query(
        'INSERT INTO Login (username, password_hash) VALUES (?, ?)',
        [user.username, user.password_hash]
      );
      return true;
    } catch (error) {
      console.error('Database error in create user:', error);
      throw error;
    }
  }
}

module.exports = new UserRepository();