// generateJWT.js - A simple script to generate a JWT token
const jwt = require('jsonwebtoken');

// Replace these values with your desired username and secret
const username = "testuser";
const jwtSecret = "JWT_SECRET=P8zd5vF3qA7rT2gK9jH6mN4bQ1xW8yL5sE3cR7vT2";

// Create a payload (the data that will be encoded in the token)
const payload = {
  username: username
};

// Generate the token with 1 hour expiration
const token = jwt.sign(
  payload,
  jwtSecret,
  { expiresIn: '1h' }
);

// Output the token
console.log("Generated JWT Token:");
console.log(token);
console.log("\nDecoded Token Payload:");
console.log(jwt.decode(token));
