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

const { auth, checkRole } = require('../middleware/auth');

// Profile routes (authenticated users)
router.get(
  '/profile',
  auth,
  getProfile
);
router.put(
  '/profile',
  auth,
  updateProfile
);

// Admin user-management routes
router.get(
  '/',
  auth,
  checkRole('admin'),
  getAllUsers
);
router.get(
  '/:id',
  auth,
  checkRole('admin'),
  getUserById
);
router.put(
  '/:id',
  auth,
  checkRole('admin'),
  updateUserRole
);
router.delete(
  '/:id',
  auth,
  checkRole('admin'),
  deleteUser
);

// User‑scoped bookings
router.get(
  '/bookings',
  auth,
  checkRole('user'),
  getUserBookings
);

// Organizer‑scoped events (ONLY organizer, not admin)
console.log('Registering /events route for organizers only');
router.get(
  '/events',
  auth,
  checkRole('organizer'),
  getUserEvents
);
router.get(
  '/events/analytics',
  auth,
  checkRole('organizer'),
  getUserEventsAnalytics
);

module.exports = router;
