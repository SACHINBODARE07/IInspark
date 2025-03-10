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

module.exports = authMiddleware;
