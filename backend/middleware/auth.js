// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');
      console.log("🔐 Token verified:", decoded);
      console.log("👤 User attached to request:", req.user);

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      next();
    } catch (error) {
      console.error("❌ Invalid token:", error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const checkRole = (allowed) => (req, res, next) => {
  console.log('checkRole:', { allowed, userRole: req.user?.role, url: req.originalUrl }); // Debug log
  if (!req.user || !req.user.role) {
    return res.status(403).json({ error: 'Access denied - no role found' });
  }
  const userRole = req.user.role.toLowerCase();
  if (Array.isArray(allowed)) {
    if (!allowed.map(r => r.toLowerCase()).includes(userRole)) {
      return res.status(403).json({ error: 'Access denied - insufficient permissions' });
    }
  } else {
    if (userRole !== allowed.toLowerCase()) {
      return res.status(403).json({ error: 'Access denied - insufficient permissions' });
    }
  }
  next();
};

module.exports = { auth, checkRole };
