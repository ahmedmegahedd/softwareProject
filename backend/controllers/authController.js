// File: backend/controllers/authController.js
const User = require('../models/User');
const jwt  = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Helper to generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' } // Increased to 24 hours
  );
};

// Helper to set auth cookie
const setAuthCookie = (res, token) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    path: '/'
  };

  console.log('[Auth] Setting cookie with options:', cookieOptions);
  res.cookie('token', token, cookieOptions);
};

// Register endpoint
exports.register = async (req, res) => {
  try {
    console.log('[Auth] Registration attempt:', { ...req.body, password: '***' });
    
    const { name, email, password, role } = req.body;
    
    // Validate required fields
    if (!name || !email || !password) {
      console.log('[Auth] Missing required fields:', { name: !!name, email: !!email, password: !!password });
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields. Please provide name, email, and password.' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('[Auth] Invalid email format:', email);
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid email format. Please provide a valid email address.' 
      });
    }

    // Validate password length
    if (password.length < 6) {
      console.log('[Auth] Password too short');
      return res.status(400).json({ 
        success: false, 
        error: 'Password must be at least 6 characters long.' 
      });
    }

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      console.log('[Auth] Email already in use:', email);
      return res.status(400).json({ 
        success: false, 
        error: 'Email already in use. Please use a different email address.' 
      });
    }

    // Validate role
    const allowedRoles = ['user', 'organizer', 'admin'];
    const normalizedRole = role ? role.toLowerCase() : 'user';
    if (!allowedRoles.includes(normalizedRole)) {
      console.log('[Auth] Invalid role:', role);
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid role. Must be either "user", "organizer", or "admin".' 
      });
    }

    // Create new user
    const user = await User.create({ 
      name, 
      email, 
      password, 
      role: normalizedRole 
    });
    console.log('[Auth] User created successfully:', { id: user._id, email: user.email, role: user.role });
    
    // Generate token and set cookie
    const token = generateToken(user);
    setAuthCookie(res, token);

    return res.status(201).json({ 
      success: true, 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('[Auth] Registration error:', err);
    return res.status(500).json({ 
      success: false, 
      error: 'Server error during registration. Please try again.' 
    });
  }
};

// Login endpoint
exports.login = async (req, res) => {
  try {
    console.log('\n[Auth] Login attempt:', { email: req.body.email });
    
    const { email, password } = req.body;
    if (!email || !password) {
      console.log('[Auth] Missing credentials');
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required.' 
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log('[Auth] User not found:', email);
      return res.status(404).json({ 
        success: false, 
        message: 'User not found. Please check your email or register.' 
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.log('[Auth] Invalid password for user:', email);
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid password. Please try again.' 
      });
    }

    // Generate token
    const token = generateToken(user);
    console.log('[Auth] Token generated for user:', { 
      id: user._id, 
      email: user.email 
    });

    // Set cookie
    setAuthCookie(res, token);
    console.log('[Auth] Cookie set successfully');

    // Send response
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    console.log('[Auth] Login successful:', userResponse);
    return res.status(200).json({ 
      success: true, 
      user: userResponse
    });
  } catch (err) {
    console.error('[Auth] Login error:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error during login. Please try again.' 
    });
  }
};

// Logout endpoint
exports.logout = (req, res) => {
  console.log('\n[Auth] Logout request');
  
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
    path: '/'
  };

  console.log('[Auth] Clearing cookie with options:', cookieOptions);
  res.clearCookie('token', cookieOptions);
  
  return res.status(200).json({ 
    success: true, 
    message: 'Logged out successfully' 
  });
};

// Password reset endpoint (send OTP)
exports.forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOTP = otp;
    user.resetOTPExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();
    // Send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: "loai.mohamed.farrag@gmail.com",
        pass: "boyimormqogoepab"
      }
    });
    await transporter.sendMail({
      to: user.email,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}`
    });
    return res.json({ success: true, message: 'OTP sent to email' });
  } catch (err) {
    console.error('forgetPassword error:', err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Reset password endpoint (verify OTP and set new password)
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, error: 'Email, OTP, and newPassword are required' });
    }
    const user = await User.findOne({ email, resetOTP: otp, resetOTPExpiry: { $gt: Date.now() } });
    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid or expired OTP' });
    }
    user.password = newPassword;
    user.resetOTP = undefined;
    user.resetOTPExpiry = undefined;
    await user.save();
    return res.status(200).json({ success: true, message: 'Password reset successful' });
  } catch (err) {
    console.error('resetPassword error:', err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
};
