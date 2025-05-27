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

// RESTful: Book tickets for an event (preferred RESTful style)
router.post(
  '/events/:eventId/bookings',
  auth,
  checkRole('user'),
  (req, res, next) => {
    req.params.eventId = req.params.eventId;
    bookTickets(req, res, next);
  }
);

// Backward compatibility: Book tickets with eventId in body
router.post(
  '/',
  auth,
  checkRole('user'),
  (req, res, next) => {
    if (!req.body.eventId) {
      return res.status(400).json({ success: false, error: 'eventId is required in body' });
    }
    req.params.eventId = req.body.eventId;
    bookTickets(req, res, next);
  }
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
