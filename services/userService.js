// services/userService.js - User business logic
const bcrypt = require('bcrypt');
const auth = require('../config/auth');
const User = require('../models/user');
const userRepository = require('../repositories/userRepository');

class UserService {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Result object with success flag and error message if any
   */
  async register(userData) {
    // Validate user data
    const validationErrors = User.validate(userData);
    if (validationErrors.length > 0) {
      return { success: false, error: validationErrors.join(', ') };
    }
    
    try {
      // Check if username already exists
      const existingUser = await userRepository.findByUsername(userData.username);
      if (existingUser) {
        return { success: false, error: 'Username already exists' };
      }
      
      // Hash password
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(userData.password, saltRounds);
      
      // Create new user object
      const user = new User({
        username: userData.username,
        password_hash: passwordHash
      });
      
      // Save to database
      await userRepository.create(user);
      
      return { success: true };
    } catch (error) {
      console.error('Error in register service:', error);
      return { success: false, error: 'Server error during registration' };
    }
  }

  /**
   * Authenticate a user
   * @param {Object} credentials - User login credentials
   * @returns {Promise<Object>} Result object with token if successful
   */
  async login(credentials) {
    try {
      // Get user from database
      const user = await userRepository.findByUsername(credentials.username);
      
      // Check if user exists and password is correct
      if (!user || !await bcrypt.compare(credentials.password, user.password_hash)) {
        return { success: false, error: 'Invalid credentials' };
      }
      
      // Generate JWT token
      const token = auth.generateToken(user);
      
      return { success: true, token };
    } catch (error) {
      console.error('Error in login service:', error);
      return { success: false, error: 'Server error during login' };
    }
  }
}

module.exports = new UserService();
