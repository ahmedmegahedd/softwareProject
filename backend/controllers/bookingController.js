const Booking = require('../models/Booking');
const Event = require('../models/Event');

// Book Tickets (Standard User only)
exports.bookTickets = async (req, res) => {
  try {
    const { eventId, tickets } = req.body;
    const event = await Event.findById(eventId);

    if (!event) return res.status(404).json({ error: 'Event not found' });
    if (event.ticketsAvailable < tickets) return res.status(400).json({ error: 'Not enough tickets available' });

    // Calculate total price
    const totalPrice = event.price * tickets;

    // Create booking
    const booking = await Booking.create({
      user: req.user.id,
      event: eventId,
      tickets,
      totalPrice,
    });

    // Update event's available tickets
    event.ticketsAvailable -= tickets;
    await event.save();

    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Get User Bookings (Standard User only)
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate('event');
    res.status(200).json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Cancel Booking (Standard User only)
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    // Check if user owns the booking
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Refund tickets to event
    const event = await Event.findById(booking.event);
    event.ticketsAvailable += booking.tickets;
    await event.save();

    // Update booking status
    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};