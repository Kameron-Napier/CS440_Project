const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
const cors = require('cors');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: 'event_details',
  waitForConnections: true,
  connectionLimit: 10
});

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5500', // Your frontend origin
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.post('/', async (req, res) => {
  const { event_id, start_time, end_time, location } = req.body;
  await pool.query(
    'INSERT INTO event_details SET ?',
    { event_id, start_time, end_time, location }
  );
  res.status(201).send();
});

app.get('/:event_id', async (req, res) => {
  const [rows] = await pool.query(
    'SELECT * FROM event_details WHERE event_id = ?',
    [req.params.event_id]
  );
  res.json(rows[0] || {});
});

app.listen(3003, () => {
  console.log('Details service running on port 3003');
});