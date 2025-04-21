// backend/controllers/eventController.js
const Event = require('../models/Event');
const Booking = require('../models/Booking');

// Public: list only approved events
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: 'approved' }).populate('organizer', 'name');
    return res.status(200).json({ success: true, data: events });
  } catch (err) {
    console.error('getEvents error:', err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Admin-only: list every event (approved, pending, declined)
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('organizer', 'name email');
    return res.status(200).json({ success: true, data: events });
  } catch (err) {
    console.error('getAllEvents error:', err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Public: get one event by ID (must be approved)
exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizer', 'name');
    if (!event) return res.status(404).json({ success: false, error: 'Event not found' });
    if (event.status !== 'approved') {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }
    return res.status(200).json({ success: true, data: event });
  } catch (err) {
    console.error('getEvent error:', err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Organizer-only: create a new event
exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, location, price, ticketsAvailable } = req.body;
    const event = await Event.create({
      title,
      description,
      date,
      location,
      price,
      ticketsAvailable,
      organizer: req.user.id,
    });
    return res.status(201).json({ success: true, data: event });
  } catch (err) {
    console.error('createEvent error:', err);
    return res.status(400).json({ success: false, error: err.message });
  }
};

// Organizer or Admin: update event
// - Organizers update their own fields
// - Admins can only change status
exports.updateEvent = async (req, res) => {
  try {
    // Admin path: only status
    if (req.user.role === 'admin') {
      const { status } = req.body;
      if (!['approved', 'pending', 'declined'].includes(status)) {
        return res.status(400).json({ success: false, error: 'Invalid status value' });
      }
      const event = await Event.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true, runValidators: true }
      );
      if (!event) return res.status(404).json({ success: false, error: 'Event not found' });
      return res.status(200).json({ success: true, data: event });
    }

    // Organizer path: update own event
    const updates = { ...req.body };
    const event = await Event.findOneAndUpdate(
      { _id: req.params.id, organizer: req.user.id },
      updates,
      { new: true, runValidators: true }
    );
    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found or unauthorized' });
    }
    return res.status(200).json({ success: true, data: event });
  } catch (err) {
    console.error('updateEvent error:', err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Organizer-only: delete their own event
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findOneAndDelete({
      _id: req.params.id,
      organizer: req.user.id,
    });
    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found or unauthorized' });
    }
    return res.status(200).json({ success: true, data: {} });
  } catch (err) {
    console.error('deleteEvent error:', err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Organizer-only: analytics on their own events
exports.getEventAnalytics = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user.id });
    const analytics = events.map(event => {
      // You may need to calculate ticketsRemaining separately
      const sold = event.ticketsAvailable - (event.ticketsRemaining ?? 0);
      return {
        eventId: event._id,
        title: event.title,
        ticketsSold: sold,
        percentageSold: (sold / event.ticketsAvailable) * 100,
      };
    });
    return res.status(200).json({ success: true, data: analytics });
  } catch (err) {
    console.error('getEventAnalytics error:', err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
};
