const jwt = require('jsonwebtoken');
const User = require('../models/User');

const isAdmin = (req, res, next) => {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    next();
  };
  
  module.exports = isAdmin;