const express = require('express');
const router = express.Router();
const { 
  createEvent, 
  getEvents, 
  getEvent, 
  updateEvent, 
  deleteEvent,
  getEventAnalytics,
} = require('../controllers/eventController');
const { authenticate, checkRole } = require('../middleware/auth');

// Public routes
router.get('/', getEvents);
router.get('/:id', getEvent);

// Organizer-only routes
router.post('/', authenticate, checkRole('organizer'), createEvent);
router.put('/:id', authenticate, checkRole('organizer'), updateEvent);
router.delete('/:id', authenticate, checkRole('organizer'), deleteEvent);
router.get('/analytics', authenticate, checkRole('organizer'), getEventAnalytics);

module.exports = router;