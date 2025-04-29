// repositories/eventRepository.js - Event data access layer
const db = require('../config/database');
const Event = require('../models/event');

class EventRepository {
  /**
   * Get all events for a user
   * @param {string} username - The username to get events for
   * @returns {Promise<Event[]>} Array of event objects
   */
  async findByUsername(username) {
    try {
      const [rows] = await db.query('SELECT * FROM events_schedule WHERE username = ?', [username]);
      return rows.map(event => new Event(event));
    } catch (error) {
      console.error('Database error in findByUsername:', error);
      throw error;
    }
  }

  /**
   * Get all events
   * @returns {Promise<Event[]>} Array of all event objects
   */
  async findAll() {
    try {
      const [rows] = await db.query('SELECT * FROM events_schedule');
      return rows.map(event => new Event(event));
    } catch (error) {
      console.error('Database error in findAll:', error);
      throw error;
    }
  }

  /**
   * Create a new event
   * @param {Event} event - The event object to create
   * @returns {Promise<boolean>} True if successful
   */
  async create(event) {
    try {
      await db.query(
        'INSERT INTO events_schedule (username, event_name, event_day, event_start_time, event_end_time) VALUES (?, ?, ?, ?, ?)',
        [event.username, event.event_name, event.event_day, event.event_start_time, event.event_end_time]
      );
      return true;
    } catch (error) {
      console.error('Database error in create event:', error);
      throw error;
    }
  }
}

module.exports = new EventRepository();