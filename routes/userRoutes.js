// routes/userRoutes.js - User API routes
const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const userController = require('../controllers/userController');

// Registration route with validation
router.post('/register', [
  body('username').trim().notEmpty(),
  body('password').trim().notEmpty()
], userController.register);
/*router.post('/register', [
  body('username')
    .trim()
    .escape()
    .isLength({ min: 3, max: 20 })
    .withMessage('Username must be 3-20 characters'),
  body('password')
    .trim()
    .escape()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/\d/)
    .withMessage('Password must contain at least one number')
], userController.register);*/

// Login route
router.post('/login', [
  body('username').trim().escape(),
  body('password').trim().escape()
], userController.login);

module.exports = router;
