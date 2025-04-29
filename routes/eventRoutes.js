const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const eventEmitter = require('../events/eventEmitter');
const { EVENT_EVENTS } = require('../events/eventTypes');

const router = express.Router();

// Get all events
router.get('/', authenticateToken, (req, res) => {
  // Emit fetch events request
  eventEmitter.emit(EVENT_EVENTS.FETCH_REQUEST, {
    user: req.user,
    res: res
  });
});

// Create a new event
router.post('/',
  authenticateToken,
  body('event_name').trim().escape().isLength({ max: 35 }),
  body('event_day').isIn(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']),
  body('event_start_time').isTime(),
  body('event_end_time').isTime(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    // Emit create event request
    eventEmitter.emit(EVENT_EVENTS.CREATE_REQUEST, {
      eventData: {
        ...req.body,
        username: req.user.username
      },
      user: req.user,
      res: res
    });
  }
);

module.exports = router;