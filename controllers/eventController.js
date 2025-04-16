const Event = require('../models/Event');

// Public: get all approved events
exports.getAllEvents = async (req, res) => {
  const events = await Event.find({ status: 'approved' });
  res.json(events);
};

// Organizer: create event
exports.createEvent = async (req, res) => {
  const event = await Event.create({
    ...req.body,
    organizer: req.user._id,
    availableTickets: req.body.totalTickets,
  });
  res.status(201).json(event);
};

// Organizer: update event
exports.updateEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event || event.organizer.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'You cannot update this event' });
  }

  event.title = req.body.title || event.title;
  event.location = req.body.location || event.location;
  event.date = req.body.date || event.date;
  event.totalTickets = req.body.totalTickets || event.totalTickets;
  event.availableTickets = req.body.availableTickets || event.availableTickets;
  event.price = req.body.price || event.price;

  await event.save();
  res.json(event);
};

// Organizer: delete event
exports.deleteEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event || event.organizer.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'You cannot delete this event' });
  }

  await event.remove();
  res.json({ message: 'Event deleted' });
};

// Admin: approve/reject event
exports.setStatus = async (req, res) => {
  const event = await Event.findById(req.params.id);
  event.status = req.body.status;
  await event.save();
  res.json(event);
};

// Organizer: get own events (to later use in analytics)
exports.getMyEvents = async (req, res) => {
  const events = await Event.find({ organizer: req.user._id });
  res.json(events);
};
exports.getAnalytics = async (req, res) => {
    try {
      const events = await Event.find({ organizer: req.user._id });
  
      const analytics = events.map(event => {
        const booked = event.totalTickets - event.remainingTickets;
        const percentage = event.totalTickets === 0 ? 0 : (booked / event.totalTickets) * 100;
  
        return {
          eventId: event._id,
          title: event.title,
          percentageBooked: Math.round(percentage),
          totalTickets: event.totalTickets,
          remainingTickets: event.remainingTickets,
        };
      });
  
      res.json(analytics);
    } catch (err) {
      res.status(500).json({ message: 'Error getting analytics', error: err.message });
    }
  };
  