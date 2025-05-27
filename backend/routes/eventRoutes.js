// backend/routes/eventRoutes.js
const express = require('express');
const router  = express.Router();

const {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  getEventAnalytics,
  getAllEvents,
  getMyEvents
} = require('../controllers/eventController');

const { auth, checkRole } = require('../middleware/auth');
const { bookTickets } = require('../controllers/bookingController');

// Public: list only approved events
router.get('/', getEvents);

// Admin and Organizer: list all events (any status)
router.get(
  '/all',
  auth,
  checkRole(['admin', 'organizer']),
  getAllEvents
);

// --- CRITICAL: Register /my and /me BEFORE /:id to avoid ObjectId cast errors ---
router.route('/me')
  .get(auth, checkRole('organizer'), getMyEvents);

router.route('/my')
  .get(auth, checkRole('organizer'), getMyEvents);
// -----------------------------------------------------------------------------

// Admin and Organizer: get event analytics
router.get(
  '/analytics',
  auth,
  checkRole(['admin', 'organizer']),
  getEventAnalytics
);

// Organizer-only: create a new event
router.post(
  '/',
  auth,
  checkRole('organizer'),
  createEvent
);

// Book tickets for an event (standard user, RESTful)
router.post(
  '/:eventId/bookings',
  auth,
  checkRole('user'),
  bookTickets
);

// NOTE: This must come AFTER /my and /me
router.route('/:id')
  .get(auth, getEvent)
  .put(auth, checkRole(['organizer', 'admin']), updateEvent)
  .patch(auth, checkRole(['admin']), async (req, res) => {
    // Only allow status update
    const { status } = req.body;
    if (!['approved', 'pending', 'declined'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
    }
    const event = await require('../models/Event').findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }
    res.json({ success: true, data: event });
  })
  .delete(auth, checkRole(['organizer', 'admin']), deleteEvent);

// Export the router function
module.exports = router;
