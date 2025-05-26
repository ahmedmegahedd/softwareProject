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

// NOTE: This must come AFTER /my and /me
router.route('/:id')
  .get(auth, getEvent)
  .put(auth, checkRole(['organizer', 'admin']), updateEvent)
  .delete(auth, checkRole(['organizer', 'admin']), deleteEvent);

// Export the router function
module.exports = router;
