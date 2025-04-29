// controllers/eventController.js - Event API controllers
const eventService = require('../services/eventService');

class EventController {
  /**
   * Get events for the authenticated user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getUserEvents(req, res) {
    try {
      const result = await eventService.getUserEvents(req.user.username);
      
      if (result.success) {
        return res.status(200).json(result.events);
      } else {
        return res.status(500).json({ error: result.error });
      }
    } catch (error) {
      console.error('Controller error in getUserEvents:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  /**
   * Get all events (admin function)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getAllEvents(req, res) {
    try {
      const result = await eventService.getAllEvents();
      
      if (result.success) {
        return res.status(200).json(result.events);
      } else {
        return res.status(500).json({ error: result.error });
      }
    } catch (error) {
      console.error('Controller error in getAllEvents:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  /**
   * Create a new event
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async createEvent(req, res) {
    try {
      const result = await eventService.createEvent(req.body, req.user.username);
      
      if (result.success) {
        return res.status(201).json({ message: 'Event created successfully' });
      } else {
        return res.status(400).json({ error: result.error });
      }
    } catch (error) {
      console.error('Controller error in createEvent:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  }
}

module.exports = new EventController();
