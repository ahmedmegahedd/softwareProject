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

// Organizer: get their own events (alias for /me to match frontend)
router.get(
  '/me',
  auth,
  checkRole('organizer'),
  getMyEvents
);

// Admin and Organizer: get event analytics
router.get(
  '/analytics',
  auth,
  checkRole(['admin', 'organizer']),
  getEventAnalytics
);

// Public: get one event by ID (only approved)
router.get('/:id', getEvent);

// Organizer-only: create a new event
router.post(
  '/',
  auth,
  checkRole('organizer'),
  createEvent
);

// Organizer or Admin: update event
router.put(
  '/:id',
  auth,
  checkRole(['organizer', 'admin']),
  updateEvent
);

// Organizer or Admin: delete event
router.delete(
  '/:id',
  auth,
  checkRole(['organizer', 'admin']),
  deleteEvent
);

// Export the router function
module.exports = router;
