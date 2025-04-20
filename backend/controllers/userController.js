// backend/controllers/userController.js
const User = require('../models/User');

// GET /api/v1/users/profile
// Returns current user (minus password)
exports.getProfile = async (req, res) => {
  try {
    // req.user.id was set by authenticate()
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.error('getProfile error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// PUT /api/v1/users/profile
// Update name/email of current user
exports.updateProfile = async (req, res) => {
  try {
    const updates = {};
    if (req.body.name)  updates.name  = req.body.name;
    if (req.body.email) updates.email = req.body.email;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true, context: 'query' }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.error('updateProfile error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};