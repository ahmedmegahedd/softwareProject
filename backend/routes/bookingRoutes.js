const express = require('express');
const router = express.Router();
const { 
  bookTickets, 
  getUserBookings, 
  cancelBooking,
} = require('../controllers/bookingController');
const { authenticate, checkRole } = require('../middleware/auth');

// Standard User-only routes
router.post('/', authenticate, checkRole('user'), bookTickets);
router.get('/', authenticate, checkRole('user'), getUserBookings);
router.delete('/:id', authenticate, checkRole('user'), cancelBooking);

module.exports = router;
