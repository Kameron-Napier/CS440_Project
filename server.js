require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use('/register', require('./routes/authRoutes'));
app.use('/login', require('./routes/authRoutes'));
app.use('/events', require('./routes/eventRoutes'));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
