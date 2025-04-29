// public/js/auth.js - Client-side authentication logic

/**
 * Check if user is authenticated
 * @returns {boolean} True if authenticated
 */
function isAuthenticated() {
  return localStorage.getItem('jwtToken') !== null;
}

/**
 * Redirect to login page if not authenticated
 */
function requireAuth() {
  if (!isAuthenticated()) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

/**
 * Get the authenticated user's username
 * @returns {string|null} Username or null if not authenticated
 */
function getUsername() {
  const token = localStorage.getItem('jwtToken');
  if (!token) return null;
  
  try {
    // Decode JWT payload
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.username;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

/**
 * Display the authenticated user in the UI
 */
function displayUser() {
  const username = getUsername();
  const userDisplay = document.getElementById('userDisplay');
  if (userDisplay && username) {
    userDisplay.innerText = username;
  }
}

/**
 * Logout the current user
 */
function logout() {
  localStorage.removeItem('jwtToken');
  window.location.href = 'login.html';
}

/**
 * Get authorization header for API requests
 * @returns {Object} Headers object with Authorization
 */
function getAuthHeaders() {
  const token = localStorage.getItem('jwtToken');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  // Check authentication if not on login or register page
  if (!window.location.href.includes('login.html') && !window.location.href.includes('register.html')) {
    requireAuth();
    displayUser();
  }

  // Setup logout button
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }

  // Setup login form
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value;

      try {
        const response = await fetch('/api/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Login failed');

        localStorage.setItem('jwtToken', data.token);
        window.location.href = 'index.html';
      } catch (error) {
        alert(error.message);
      }
    });
  }

  // Setup registration form
  const registrationForm = document.getElementById('registrationForm');
  if (registrationForm) {
    registrationForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value;

      try {
        const response = await fetch('/api/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Registration failed');
        }

        alert('Registration successful! Please login.');
        window.location.href = 'login.html';
      } catch (error) {
        alert(`Registration failed: ${error.message}`);
      }
    });
  }
});