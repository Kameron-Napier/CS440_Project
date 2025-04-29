// public/js/events.js - Client-side event management

// No import needed - we'll use global functions from auth.js

// Day order for displaying events
const dayOrder = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/**
 * Fetch and render events
 */
async function fetchAndRenderEvents() {
  // Check authentication
  if (!requireAuth()) return;

  try {
    const response = await fetch('/api/events', {
      headers: getAuthHeaders()
    });

    if (response.status === 401) {
      // Handle expired token
      localStorage.removeItem('jwtToken');
      window.location.href = 'login.html';
      return;
    }

    const events = await response.json();
    renderEventSchedule(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    alert('Failed to load events. Please try again later.');
  }
}

/**
 * Render events in the weekly schedule table
 * @param {Array} events - Array of event objects
 */
function renderEventSchedule(events) {
  const table = document.getElementById("eventsTableBody");
  if (!table) return;
  
  table.innerHTML = "";

  // Group events by day
  const eventsByDay = {};
  dayOrder.forEach(day => {
    eventsByDay[day] = [];
  });

  events.forEach(event => {
    eventsByDay[event.event_day].push(event);
  });

  // Determine the maximum number of events on any day
  let maxRows = 0;
  Object.values(eventsByDay).forEach(dayEvents => {
    if (dayEvents.length > maxRows) maxRows = dayEvents.length;
  });

  // Create table rows for each event slot
  for (let i = 0; i < maxRows; i++) {
    const row = table.insertRow();
    
    dayOrder.forEach(day => {
      const cell = row.insertCell();
      
      if (eventsByDay[day][i]) {
        const event = eventsByDay[day][i];
        cell.innerHTML = `
          <div class="event-card">
            <strong>${event.event_name}</strong><br>
            ${formatTime(event.event_start_time)} - ${formatTime(event.event_end_time)}
          </div>
        `;
      }
    });
  }
}

/**
 * Format time in 12-hour format
 * @param {string} time - Time in 24-hour format (HH:MM)
 * @returns {string} Time in 12-hour format with AM/PM
 */
function formatTime(time) {
  if (!time) return '';
  
  let [hour, minute] = time.split(":");
  let period = "AM";
  
  hour = parseInt(hour);
  if (hour >= 12) {
    period = "PM";
    if (hour > 12) hour -= 12;
  } else if (hour === 0) {
    hour = 12;
  }
  
  return `${hour}:${minute} ${period}`;
}

/**
 * Setup event form submission
 */
function setupEventForm() {
  const eventForm = document.getElementById("eventForm");
  if (!eventForm) return;
  
  eventForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const eventData = {
      event_name: document.getElementById("event_name").value,
      event_day: document.getElementById("event_day").value,
      event_start_time: document.getElementById("event_start_time").value,
      event_end_time: document.getElementById("event_end_time").value
    };

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(eventData)
      });

      if (response.status === 401) {
        localStorage.removeItem('jwtToken');
        window.location.href = 'login.html';
        return;
      }

      if (response.ok) {
        alert('Event added successfully');
        eventForm.reset();
        fetchAndRenderEvents();
      } else {
        const error = await response.json();
        alert('Error adding event: ' + (error.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error adding event:', error);
      alert('Failed to connect to server');
    }
  });
}

// Initialize everything when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Only initialize if on the main page
  if (document.getElementById('eventsTableBody')) {
    setupEventForm();
    fetchAndRenderEvents();
  }
});