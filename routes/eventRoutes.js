const express = require('express');
const router = express.Router();
const {
    getAllEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    setStatus,
    getMyEvents,
    getAnalytics, // <-- add this
  } = require('../controllers/eventController');
  
const { protect, restrictTo } = require('../middleware/auth');

// Public
router.get('/', getAllEvents);

// Organizer
router.post('/', protect, restrictTo('organizer'), createEvent);
router.put('/:id', protect, restrictTo('organizer'), updateEvent);
router.delete('/:id', protect, restrictTo('organizer'), deleteEvent);
router.get('/my-events', protect, restrictTo('organizer'), getMyEvents);

// Admin
router.put('/:id/status', protect, restrictTo('admin'), setStatus);
router.get('/analytics', protect, restrictTo('organizer'), getAnalytics);

module.exports = router;
