// routes/eventRoutes.js - Event API routes
const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Apply authentication middleware to all event routes
router.use(authenticateToken);

// Get user's events
router.get('/user', eventController.getUserEvents);

// Get all events (could be restricted to admin in the future)
router.get('/', eventController.getAllEvents);

// Create new event with validation
router.post('/', [
  body('event_name')
    .trim()
    .escape()
    .isLength({ min: 1, max: 35 })
    .withMessage('Event name must be 1-35 characters'),
  body('event_day')
    .isIn(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'])
    .withMessage('Invalid day selection'),
  body('event_start_time')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage('Invalid start time format'),
  body('event_end_time')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage('Invalid end time format')
], eventController.createEvent);

module.exports = router;
