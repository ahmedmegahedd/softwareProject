// File: backend/controllers/authController.js
const User = require('../models/User');
const jwt  = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Helper to generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '3h' }
  );
};

// Register endpoint
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, error: 'Email already in use' });
    }
    const user = await User.create({ name, email, password, role });
    const token = generateToken(user);
    return res.status(201).json({ success: true, token, user });
  } catch (err) {
    console.error('register error:', err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Login endpoint
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password required' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    const token = generateToken(user);
    return res.status(200).json({ success: true, token, user });
  } catch (err) {
    console.error('login error:', err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Password reset endpoint
exports.forgetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ success: false, error: 'Email and newPassword are required' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    return res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    console.error('forgetPassword error:', err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
};
