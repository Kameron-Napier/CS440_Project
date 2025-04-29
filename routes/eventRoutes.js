const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { body } = require('express-validator');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/', authenticateToken, eventController.getEvents);

router.post('/',
    authenticateToken,
    body('event_name').trim().escape().isLength({ max: 35 }),
    body('event_day').isIn(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']),
    body('event_start_time').matches(/^([01]\d|2[0-3]):([0-5]\d)$/),
    body('event_end_time').matches(/^([01]\d|2[0-3]):([0-5]\d)$/),
    eventController.addEvent
);

module.exports = router;
