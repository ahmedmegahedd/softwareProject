// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  // Debug logging
  console.log('\n[Auth Middleware] Request details:', {
    path: req.path,
    method: req.method,
    cookies: req.cookies,
    headers: {
      origin: req.headers.origin,
      referer: req.headers.referer,
      cookie: req.headers.cookie
    }
  });

  // Extract token from cookie only
  const token = req.cookies?.token;
  console.log('[Auth Middleware] Token from cookie:', token ? 'Present' : 'Missing');

  if (!token) {
    console.log('[Auth Middleware] No token found in cookies');
    return res.status(401).json({
      success: false,
      message: 'Authentication required - no token found'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('[Auth Middleware] Token verified:', {
      userId: decoded.id,
      role: decoded.role
    });

    // Find user
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      console.log('[Auth Middleware] User not found for id:', decoded.id);
      return res.status(401).json({
        success: false,
        message: 'Authentication failed - user not found'
      });
    }

    // Attach user to request
    req.user = user;
    console.log('[Auth Middleware] User authenticated:', {
      id: user._id,
      email: user.email,
      role: user.role
    });

    next();
  } catch (error) {
    console.error('[Auth Middleware] Token verification failed:', {
      error: error.message,
      name: error.name,
      stack: error.stack
    });

    // Clear invalid token
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      path: '/'
    });

    return res.status(401).json({
      success: false,
      message: 'Authentication failed - invalid token'
    });
  }
};

const checkRole = (allowed) => (req, res, next) => {
  console.log('\n[Role Check] Request details:', {
    path: req.path,
    method: req.method,
    userRole: req.user?.role,
    allowedRoles: Array.isArray(allowed) ? allowed : [allowed]
  });

  if (!req.user || !req.user.role) {
    console.log('[Role Check] No user or role found');
    return res.status(403).json({
      success: false,
      message: 'Access denied - no role found'
    });
  }

  const userRole = req.user.role.toLowerCase();
  const allowedRoles = Array.isArray(allowed)
    ? allowed.map(r => r.toLowerCase())
    : [allowed.toLowerCase()];

  if (!allowedRoles.includes(userRole)) {
    console.log('[Role Check] Insufficient permissions:', {
      userRole,
      allowedRoles
    });
    return res.status(403).json({
      success: false,
      message: 'Access denied - insufficient permissions'
    });
  }

  console.log('[Role Check] Access granted:', {
    userRole,
    path: req.path
  });
  next();
};

module.exports = { auth, checkRole };
