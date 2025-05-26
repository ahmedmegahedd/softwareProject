// File: backend/routes/authRoutes.js
const express = require('express');
const router  = express.Router();
const {
  register,
  login,
  forgetPassword,
  resetPassword
} = require('../controllers/authController');

// Public auth routes
router.post('/register', register);
router.post('/login',    login);
router.put('/forgetPassword', forgetPassword);
router.put('/resetPassword', resetPassword);
router.post('/logout', require('../controllers/authController').logout);

module.exports = router;
