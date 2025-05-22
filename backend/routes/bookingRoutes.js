// backend/routes/bookingRoutes.js
const express = require('express');
const router  = express.Router();

const {
  bookTickets,
  getUserBookings,
  getBookingById,
  cancelBooking
} = require('../controllers/bookingController');

const { authenticate, checkRole } = require('../middleware/auth');

// 1. Book tickets (standard user)
router.post(
  '/',
  authenticate,
  checkRole('user'),
  bookTickets
);

// 2. List current user's bookings
router.get(
  '/',
  authenticate,
  checkRole('user'),
  getUserBookings
);

// 3. Get a specific booking
router.get(
  '/:id',
  authenticate,
  checkRole('user'),
  getBookingById
);

// 4. Cancel a booking
router.delete(
  '/:id',
  authenticate,
  checkRole('user'),
  cancelBooking
);

module.exports = router;
