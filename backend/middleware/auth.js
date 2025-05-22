// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

/**
 * CheckRole middleware: `allowed` can be a single role string,
 * or an array of role strings
 */
exports.checkRole = (allowed) => (req, res, next) => {
  const userRole = req.user.role;
  if (Array.isArray(allowed)) {
    if (!allowed.includes(userRole)) {
      return res.status(403).json({ error: 'Access denied' });
    }
  } else {
    if (userRole !== allowed) {
      return res.status(403).json({ error: 'Access denied' });
    }
  }
  next();
};
