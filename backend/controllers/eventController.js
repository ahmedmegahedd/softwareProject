// backend/controllers/eventController.js
const Event = require('../models/Event');
const { NotFoundError, UnauthorizedError } = require('../utils/errors');

// Get all approved events (public)
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: 'approved' })
      .sort({ date: 1 })
      .populate('organizer', 'name email');
    res.json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all events (admin and organizer)
exports.getAllEvents = async (req, res) => {
  try {
    const query = {};
    // If organizer, only show their events
    if (req.user.role === 'organizer') {
      query.organizer = req.user.id;
    }
    
    const events = await Event.find(query)
      .sort({ date: 1 })
      .populate('organizer', 'name email');
    res.json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get organizer's events
exports.getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user.id })
      .sort({ date: 1 });
    res.json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get single event
exports.getEvent = async (req, res) => {
  try {
    console.log('[Backend] Fetching event', req.params.id, 'for user', req.user?.id, 'role', req.user?.role);
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name email');
    
    if (!event) {
      console.log('[Backend] Event not found', req.params.id);
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }


    // Check authorization
    if ( req.user?.role !== 'admin' && event.organizer.toString() !== req.user.id.toString()) {
      console.log('hiiiiiiiiiiiiiiiiiiii1')
      console.log('[Backend] Not authorized to view event', req.params.id, 'user', req.user?.id, 'organizer', event.organizer.toString());
      return res.status(401).json({
        success: false,
        error: 'Not authorized to view this event'
      });
    }

    console.log('[Backend] Sending event data:', event);
    return res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('[Backend] Get event error:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      error: error.message
    });
  }
};

// Create event
exports.createEvent = async (req, res) => {
  try {
    const event = new Event({
      ...req.body,
      organizer: req.user.id,
      status: 'pending'
    });
    await event.save();
    res.status(201).json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update event
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      console.log('Update: Event not found', req.params.id);
      return res.status(404).json({ success: false, error: 'Event not found' });
    }
    // Only admin or the event's organizer can update
    const isAdmin = req.user.role === 'admin';
    const isOrganizer = event.organizer.toString() === req.user.id.toString();
    if (!isAdmin && !isOrganizer) {
      console.log('Update: Not authorized', req.user.id, event.organizer.toString());
      return res.status(401).json({ success: false, error: 'Not authorized to update this event' });
    }
    // If organizer is updating, set status back to pending
    if (req.user.role === 'organizer') {
      req.body.status = 'pending';
    }
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.json({ success: true, data: updatedEvent });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(error.statusCode || 500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Delete event
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      console.log('Delete: Event not found', req.params.id);
      throw new NotFoundError('Event not found');
    }
    // Check if user is authorized to delete
    if (req.user.role !== 'admin' && event.organizer.toString() !== req.user.id) {
      console.log('Delete: Not authorized', req.user.id, event.organizer.toString());
      throw new UnauthorizedError('Not authorized to delete this event');
    }
    await Event.findByIdAndDelete(req.params.id);
    res.json({ success: true, data: {} });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(error.statusCode || 500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Get event analytics
exports.getEventAnalytics = async (req, res) => {
  try {
    const query = {};
    // If organizer, only show their events
    if (req.user.role === 'organizer') {
      query.organizer = req.user.id;
    }

    const events = await Event.find(query)
      .select('title ticketsAvailable ticketsSold price status')
      .sort({ date: 1 });

    const analytics = events.map(event => ({
      id: event._id,
      title: event.title,
      totalTickets: event.ticketsAvailable + (event.ticketsSold || 0),
      ticketsSold: event.ticketsSold || 0,
      ticketsAvailable: event.ticketsAvailable,
      revenue: (event.ticketsSold || 0) * event.price,
      status: event.status
    }));

    res.json({ success: true, data: analytics });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
