// models/user.js - User model
class User {
  constructor(data) {
    this.username = data.username;
    this.password_hash = data.password_hash;
  }

  // Validate user data
  static validate(userData) {
    const errors = [];
    
    // Username validation
    if (!userData.username || userData.username.trim().length < 3 || userData.username.trim().length > 20) {
      errors.push('Username must be 3-20 characters');
    }
    
    // Password validation - only check on registration
    if (userData.password) {
      if (userData.password.length < 8) {
        errors.push('Password must be at least 8 characters');
      }
      
      // Check for at least one uppercase letter
      if (!/[A-Z]/.test(userData.password)) {
        errors.push('Password must contain at least one uppercase letter');
      }
      
      // Check for at least one number
      if (!/\d/.test(userData.password)) {
        errors.push('Password must contain at least one number');
      }
    }
    
    return errors;
  }
}

module.exports = User;
