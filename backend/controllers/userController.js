// backend/controllers/userController.js
const User    = require('../models/User');
const Booking = require('../models/Booking');
const Event   = require('../models/Event');

// 1. Get current user’s profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    return res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.error('getProfile error:', err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
};

// 2. Update current user’s profile
exports.updateProfile = async (req, res) => {
  try {
    const updates = { ...req.body };
    delete updates.role; // prevent role changes here
    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');
    return res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.error('updateProfile error:', err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
};

// 3. Admin: list all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    return res.status(200).json({ success: true, data: users });
  } catch (err) {
    console.error('getAllUsers error:', err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
};

// 4. Admin: get single user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    return res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.error('getUserById error:', err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
};

// 5. Admin: update a user’s role
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user','organizer','admin'].includes(role)) {
      return res.status(400).json({ success: false, error: 'Invalid role' });
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    return res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.error('updateUserRole error:', err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
};

// 6. Admin: delete a user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    return res.status(200).json({ success: true, data: {} });
  } catch (err) {
    console.error('deleteUser error:', err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
};

// 7. User‑scoped: get current user’s bookings
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate('event');
    return res.status(200).json({ success: true, data: bookings });
  } catch (err) {
    console.error('getUserBookings error:', err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
};

// 8. Organizer‑scoped: get current organizer’s own events
exports.getUserEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user.id });
    return res.status(200).json({ success: true, data: events });
  } catch (err) {
    console.error('getUserEvents error:', err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
};

// 9. Organizer‑scoped: get analytics for current organizer’s events
exports.getUserEventsAnalytics = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user.id });
    const analytics = events.map(event => {
      const sold = event.ticketsAvailable - (event.ticketsRemaining ?? 0);
      return {
        eventId:       event._id,
        title:         event.title,
        ticketsSold:   sold,
        percentageSold: (sold / event.ticketsAvailable) * 100
      };
    });
    return res.status(200).json({ success: true, data: analytics });
  } catch (err) {
    console.error('getUserEventsAnalytics error:', err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
};
