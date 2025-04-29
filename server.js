require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');

// Import database connection
const { connectToDatabase } = require('./db/connection');

// Import subscribers
const { initUserSubscribers } = require('./subscribers/userSubscriber');
const { initEventSubscribers } = require('./subscribers/eventSubscriber');

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve static files from the src directory

// Initialize routes
app.use('/', authRoutes);
app.use('/events', eventRoutes);

// Initialize subscribers
initUserSubscribers();
initEventSubscribers();

// Connect to database
connectToDatabase();

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
