// backend/controllers/bookingController.js
const Booking = require('../models/Booking');
const Event   = require('../models/Event');

// 1. Book Tickets (Standard User only)
exports.bookTickets = async (req, res) => {
  try {
    const { tickets } = req.body;
    const eventId = req.params.eventId;

    if (!tickets || tickets < 1) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please specify a valid number of tickets' 
      });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ 
        success: false, 
        error: 'Event not found' 
      });
    }

    if (event.status !== 'approved') {
      return res.status(400).json({ 
        success: false, 
        error: 'This event is not available for booking' 
      });
    }

    if (event.ticketsAvailable < tickets) {
      return res.status(400).json({ 
        success: false, 
        error: `Only ${event.ticketsAvailable} tickets available` 
      });
    }

    // Deduct tickets and save
    event.ticketsAvailable -= tickets;
    await event.save();

    // Create booking
    const booking = await Booking.create({
      user: req.user.id,
      event: eventId,
      tickets,
      totalPrice: event.price * tickets,
      status: 'confirmed'
    });

    return res.status(201).json({ 
      success: true, 
      data: booking
    });
  } catch (err) {
    console.error('bookTickets error:', err);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to process booking. Please try again.' 
    });
  }
};

// 2. List Current User's Bookings
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking
      .find({ user: req.user.id })
      .populate('event', 'title date location price')
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: bookings });
  } catch (err) {
    console.error('getUserBookings error:', err);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch bookings' 
    });
  }
};

// 3. Get Booking by ID (Standard User only)
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking
      .findById(req.params.id)
      .populate('event', 'title date location price');

    if (!booking) {
      return res.status(404).json({ 
        success: false, 
        error: 'Booking not found' 
      });
    }

    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        error: 'Access denied' 
      });
    }

    return res.status(200).json({ success: true, data: booking });
  } catch (err) {
    console.error('getBookingById error:', err);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch booking details' 
    });
  }
};

// 4. Cancel Booking (Standard User only)
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ 
        success: false, 
        error: 'Booking not found' 
      });
    }

    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        error: 'Access denied' 
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ 
        success: false, 
        error: 'Booking already cancelled' 
      });
    }

    // Refund tickets
    const event = await Event.findById(booking.event);
    if (!event) {
      return res.status(404).json({ 
        success: false, 
        error: 'Associated event not found' 
      });
    }

    event.ticketsAvailable += booking.tickets;
    await event.save();

    // Mark booking cancelled
    booking.status = 'cancelled';
    await booking.save();

    return res.status(200).json({ 
      success: true, 
      data: booking
    });
  } catch (err) {
    console.error('cancelBooking error:', err);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to cancel booking' 
    });
  }
};
