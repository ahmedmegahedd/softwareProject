const Event = require('../models/Event');
const Booking = require('../models/Booking');

// Create Event (Organizer only)
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
      organizer: req.user.id, // Attach organizer ID from JWT
    });
    res.status(201).json({ success: true, data: event });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Get All Events (Public)
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: 'approved' }); // Only show approved events
    res.status(200).json({ success: true, data: events });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Get Single Event (Public)
exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.status(200).json({ success: true, data: event });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Update Event (Organizer or Admin)
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    // Check if user is organizer or admin
    if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: updatedEvent });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Delete Event (Organizer or Admin)
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    // Check if user is organizer or admin
    if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await event.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Get Event Analytics (Organizer only)
exports.getEventAnalytics = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user.id });
    const analytics = events.map(event => ({
      eventId: event._id,
      title: event.title,
      ticketsSold: event.ticketsAvailable - event.ticketsRemaining,
      percentageSold: ((event.ticketsAvailable - event.ticketsRemaining) / event.ticketsAvailable) * 100,
    }));
    res.status(200).json({ success: true, data: analytics });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};