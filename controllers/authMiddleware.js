const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Get token from header
  const token = req.header('Authorization');

  // Check if token exists
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    req.user = decoded.user; // Attach user to request object
    next();
  } catch (error) {
    console.error('Error during authentication:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;