/**
 * Event type constants for the application
 * This centralizes all event names to avoid typos and ensure consistency
 */

const USER_EVENTS = {
  REGISTER_REQUEST: 'user:register:request',
  REGISTER_SUCCESS: 'user:register:success',
  REGISTER_FAILURE: 'user:register:failure',
  LOGIN_REQUEST: 'user:login:request',
  LOGIN_SUCCESS: 'user:login:success',
  LOGIN_FAILURE: 'user:login:failure'
};

const EVENT_EVENTS = {
  FETCH_REQUEST: 'event:fetch:request',
  FETCH_SUCCESS: 'event:fetch:success',
  FETCH_FAILURE: 'event:fetch:failure',
  CREATE_REQUEST: 'event:create:request',
  CREATE_SUCCESS: 'event:create:success',
  CREATE_FAILURE: 'event:create:failure'
};

const DB_EVENTS = {
  CONNECT_SUCCESS: 'db:connect:success',
  CONNECT_FAILURE: 'db:connect:failure',
  QUERY_SUCCESS: 'db:query:success',
  QUERY_FAILURE: 'db:query:failure'
};

module.exports = {
  USER_EVENTS,
  EVENT_EVENTS,
  DB_EVENTS
};