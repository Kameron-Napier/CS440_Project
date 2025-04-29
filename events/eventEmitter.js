const EventEmitter = require('events');

/**
 * Application event emitter singleton
 * This is the central hub for all application events
 */
class AppEventEmitter extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(20);
  }
}

const eventEmitter = new AppEventEmitter();

module.exports = eventEmitter;