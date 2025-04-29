// services/eventService.js - Event business logic
const Event = require('../models/event');
const eventRepository = require('../repositories/eventRepository');

class EventService {
  /**
   * Get all events for a user
   * @param {string} username - The username to get events for
   * @returns {Promise<Object>} Result object with events array
   */
  async getUserEvents(username) {
    try {
      const events = await eventRepository.findByUsername(username);
      return { success: true, events };
    } catch (error) {
      console.error('Error in getUserEvents service:', error);
      return { success: false, error: 'Failed to retrieve events' };
    }
  }

  /**
   * Get all events (admin function)
   * @returns {Promise<Object>} Result object with events array
   */
  async getAllEvents() {
    try {
      const events = await eventRepository.findAll();
      return { success: true, events };
    } catch (error) {
      console.error('Error in getAllEvents service:', error);
      return { success: false, error: 'Failed to retrieve events' };
    }
  }

  /**
   * Create a new event
   * @param {Object} eventData - Event data
   * @param {string} username - Username of the event creator
   * @returns {Promise<Object>} Result object with success flag
   */
  async createEvent(eventData, username) {
    // Add username to event data
    const fullEventData = {
      ...eventData,
      username
    };
    
    // Validate event data
    const validationErrors = Event.validate(fullEventData);
    if (validationErrors.length > 0) {
      return { success: false, error: validationErrors.join(', ') };
    }
    
    try {
      // Create new event object
      const event = new Event(fullEventData);
      
      // Save to database
      await eventRepository.create(event);
      
      return { success: true };
    } catch (error) {
      console.error('Error in createEvent service:', error);
      return { success: false, error: 'Failed to create event' };
    }
  }
}

module.exports = new EventService();
