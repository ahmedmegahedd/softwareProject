// backend/routes/userRoutes.js
const express = require('express');
const router  = express.Router();

const {
  getProfile,
  updateProfile,
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  getUserBookings,
  getUserEvents,
  getUserEventsAnalytics
} = require('../controllers/userController');

const { authenticate, checkRole } = require('../middleware/auth');

// Profile routes (authenticated users)
router.get(
  '/profile',
  authenticate,
  getProfile
);
router.put(
  '/profile',
  authenticate,
  updateProfile
);

// Admin user-management routes
router.get(
  '/',
  authenticate,
  checkRole('admin'),
  getAllUsers
);
router.get(
  '/:id',
  authenticate,
  checkRole('admin'),
  getUserById
);
router.put(
  '/:id',
  authenticate,
  checkRole('admin'),
  updateUserRole
);
router.delete(
  '/:id',
  authenticate,
  checkRole('admin'),
  deleteUser
);

// User‑scoped bookings
router.get(
  '/bookings',
  authenticate,
  checkRole('user'),
  getUserBookings
);

// Organizer‑scoped events
router.get(
  '/events',
  authenticate,
  checkRole('organizer'),
  getUserEvents
);
router.get(
  '/events/analytics',
  authenticate,
  checkRole('organizer'),
  getUserEventsAnalytics
);

module.exports = router;
