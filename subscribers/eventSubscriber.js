const eventEmitter = require('../events/eventEmitter');
const { EVENT_EVENTS } = require('../events/eventTypes');
const { query } = require('../db/connection');

/**
 * Initialize event subscribers
 * Sets up event listeners for event-related events
 */
function initEventSubscribers() {
  // Handle fetch events request
  eventEmitter.on(EVENT_EVENTS.FETCH_REQUEST, async ({ user, res }) => {
    try {
      // Fetch all events
      const events = await query('SELECT * FROM events_schedule');
      
      res.json(events);
      eventEmitter.emit(EVENT_EVENTS.FETCH_SUCCESS, { events });
    } catch (err) {
      console.error('Error fetching events:', err);
      res.status(500).send('Database error');
      eventEmitter.emit(EVENT_EVENTS.FETCH_FAILURE, { error: err.message });
    }
  });

  // Handle create event request
  eventEmitter.on(EVENT_EVENTS.CREATE_REQUEST, async ({ eventData, user, res }) => {
    try {
      // Insert the event into the database
      await query(
        'INSERT INTO events_schedule SET ?',
        eventData
      );
      
      res.status(201).send('Event added');
      eventEmitter.emit(EVENT_EVENTS.CREATE_SUCCESS, { eventData });
    } catch (err) {
      console.error('Error creating event:', err);
      res.status(500).send('Database error');
      eventEmitter.emit(EVENT_EVENTS.CREATE_FAILURE, { error: err.message });
    }
  });
}

module.exports = {
  initEventSubscribers
};