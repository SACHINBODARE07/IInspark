const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  // Extract the token from the Authorization header
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Authorization token is missing' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, 'your_jwt_secret');
    
    // Find the user by id decoded from the token
    const user = await User.findById(decoded.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Attach the user object to the request
    req.user = user;

    next(); // Proceed to the next middleware
  } catch (error) {
    console.error('Error during authentication:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

const isAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  next();
};

module.exports = isAdmin;
module.exports = authMiddleware;
