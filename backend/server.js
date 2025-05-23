// backend/server.js
require('dotenv').config();
const express    = require('express');
const mongoose   = require('mongoose');
const cors       = require('cors');
const connectDB  = require('./config/database');

const authRoutes    = require('./routes/authRoutes');
const userRoutes    = require('./routes/userRoutes');
const eventRoutes   = require('./routes/eventRoutes');    // ← make sure path is correct
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// ─── DEBUG: Verify that each import is actually an Express Router ─────────────────────
console.log('🚀 authRoutes:',    typeof authRoutes);
console.log('🚀 userRoutes:',    typeof userRoutes);
console.log('🚀 eventRoutes:',   typeof eventRoutes);
console.log('🚀 bookingRoutes:', typeof bookingRoutes);
// ──────────────────────────────────────────────────────────────────────────────────────

// Mount routers
app.use('/api/v1',         authRoutes);
app.use('/api/v1/users',   userRoutes);
app.use('/api/v1/events',  eventRoutes);
app.use('/api/v1/bookings',bookingRoutes);

// Connect to MongoDB
connectDB();

// Central error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Server Error' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});


