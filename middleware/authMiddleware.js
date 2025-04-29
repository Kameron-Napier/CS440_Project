// middleware/authMiddleware.js - Authentication middleware
const auth = require('../config/auth');

/**
 * Middleware to authenticate requests using JWT
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  const user = auth.verifyToken(token);
  
  if (!user) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
  
  req.user = user;
  next();
};

module.exports = {
  authenticateToken
};
