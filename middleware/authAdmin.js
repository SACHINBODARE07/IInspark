const jwt = require('jsonwebtoken');

const authAdmin = (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    req.user = decoded.user;

    // Check if user is an admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ msg: 'Unauthorized: Admin access required' });
    }

    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = authAdmin;