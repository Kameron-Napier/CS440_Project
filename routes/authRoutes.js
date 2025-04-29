const express = require('express');
const { body, validationResult } = require('express-validator');
const eventEmitter = require('../events/eventEmitter');
const { USER_EVENTS } = require('../events/eventTypes');

const router = express.Router();

// Registration endpoint
router.post('/register',
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

    // Emit register request event
    eventEmitter.emit(USER_EVENTS.REGISTER_REQUEST, { 
      userData: req.body,
      res: res
    });
  }
);

// Login endpoint
router.post('/login',
  body('username').trim().escape(),
  body('password').trim().escape(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    // Emit login request event
    eventEmitter.emit(USER_EVENTS.LOGIN_REQUEST, {
      userData: req.body,
      res: res
    });
  }
);

module.exports = router;