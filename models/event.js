// models/event.js - Event model
class Event {
  constructor(data) {
    this.event_id = data.event_id;
    this.username = data.username;
    this.event_name = data.event_name;
    this.event_day = data.event_day;
    this.event_start_time = data.event_start_time;
    this.event_end_time = data.event_end_time;
  }

  // Validate event data
  static validate(eventData) {
    const errors = [];
    const validDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    // Event name validation
    if (!eventData.event_name || eventData.event_name.trim().length === 0 || eventData.event_name.trim().length > 35) {
      errors.push('Event name must be 1-35 characters');
    }
    
    // Day validation
    if (!eventData.event_day || !validDays.includes(eventData.event_day)) {
      errors.push('Invalid day selection');
    }
    
    // Time validation - basic format check
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    
    if (!eventData.event_start_time || !timeRegex.test(eventData.event_start_time)) {
      errors.push('Invalid start time format');
    }
    
    if (!eventData.event_end_time || !timeRegex.test(eventData.event_end_time)) {
      errors.push('Invalid end time format');
    }
    
    // Check if end time is after start time
    if (eventData.event_start_time && eventData.event_end_time && 
        eventData.event_start_time >= eventData.event_end_time) {
      errors.push('End time must be after start time');
    }
    
    return errors;
  }
}

module.exports = Event;
