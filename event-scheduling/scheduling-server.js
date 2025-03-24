const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
const cors = require('cors');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: 'event_scheduling',
  waitForConnections: true,
  connectionLimit: 10
});

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5500', // Your frontend origin
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.get('/', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM event_schedule');
  res.json(rows);
});

app.post('/', async (req, res) => {
  const { user_id, event_name, event_day } = req.body;
  const [result] = await pool.query(
    'INSERT INTO event_schedule SET ?',
    { user_id, event_name, event_day }
  );
  res.status(201).json({ event_id: result.insertId });
});

app.listen(3002, () => {
  console.log('Scheduling service running on port 3002');
});