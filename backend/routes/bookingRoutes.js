// backend/routes/bookingRoutes.js
const express = require('express');
const router  = express.Router();

const {
  bookTickets,
  getUserBookings,
  getBookingById,
  cancelBooking
} = require('../controllers/bookingController');

const { auth, checkRole } = require('../middleware/auth');

// 1. Book tickets (standard user)
router.post(
  '/:eventId',
  auth,
  checkRole('user'),
  bookTickets
);

// 2. List current user's bookings
router.get(
  '/',
  auth,
  checkRole('user'),
  getUserBookings
);

// 3. Get a specific booking
router.get(
  '/:id',
  auth,
  checkRole('user'),
  getBookingById
);

// 4. Cancel a booking
router.delete(
  '/:id',
  auth,
  checkRole('user'),
  cancelBooking
);

module.exports = router;
