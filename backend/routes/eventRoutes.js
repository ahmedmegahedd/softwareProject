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
  getAllEvents
} = require('../controllers/eventController');

const { authenticate, checkRole } = require('../middleware/auth');

// Public: list only approved events
router.get('/', getEvents);

// Admin-only: list all events (any status)
router.get(
  '/all',
  authenticate,
  checkRole('admin'),
  getAllEvents
);

// Organizer-only: analytics on their own events
router.get(
  '/analytics',
  authenticate,
  checkRole('organizer'),
  getEventAnalytics
);

// Public: get one event by ID (only approved)
router.get('/:id', getEvent);

// Organizer-only: create a new event
router.post(
  '/',
  authenticate,
  checkRole('organizer'),
  createEvent
);

// Organizer or Admin: update event
router.put(
  '/:id',
  authenticate,
  checkRole(['organizer', 'admin']),
  updateEvent
);

// Organizer-only: delete their own event
router.delete(
  '/:id',
  authenticate,
  checkRole('organizer'),
  deleteEvent
);

// Export the router function
module.exports = router;
