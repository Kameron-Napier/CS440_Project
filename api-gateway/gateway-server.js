const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const jwt = require('jsonwebtoken');
const app = express();
require('dotenv').config();

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.sendStatus(401);
  
  jwt.verify(token, process.env.JWT_SECRET, (err) => {
    if (err) return res.sendStatus(403);
    next();
  });
};

// Route configuration
app.use('/auth', createProxyMiddleware({
  target: 'http://user-auth:3001',
  changeOrigin: true,
  pathRewrite: { '^/auth': '' }
}));

app.use('/events', authenticateToken, createProxyMiddleware({
  target: 'http://event-scheduling:3002',
  changeOrigin: true,
  pathRewrite: { '^/events': '' }
}));

app.use('/details', authenticateToken, createProxyMiddleware({
  target: 'http://event-details:3003',
  changeOrigin: true,
  pathRewrite: { '^/details': '' }
}));

app.listen(3000, () => {
  console.log('API Gateway running on port 3000');
});