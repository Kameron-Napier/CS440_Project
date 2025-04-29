// controllers/userController.js - User API controllers
const userService = require('../services/userService');

class UserController {
  /**
   * Register a new user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async register(req, res) {
    try {
      console.log("Registration request body:", req.body); // Add this debug line
      const result = await userService.register(req.body);
      
      if (result.success) {
        return res.status(201).json({ message: 'User created successfully' });
      } else {
        console.log("Registration failed:", result.error); // Add this debug line
        return res.status(400).json({ error: result.error });
      }
    } catch (error) {
      console.error('Controller error in register:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  /**
   * Login a user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async login(req, res) {
    try {
      const result = await userService.login(req.body);
      
      if (result.success) {
        return res.status(200).json({ token: result.token });
      } else {
        return res.status(401).json({ error: result.error });
      }
    } catch (error) {
      console.error('Controller error in login:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  }
}

module.exports = new UserController();
