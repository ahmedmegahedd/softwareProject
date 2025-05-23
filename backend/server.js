// backend/server.js
require('dotenv').config();
const express    = require('express');
const mongoose   = require('mongoose');
const cors       = require('cors');

const authRoutes    = require('./routes/authRoutes');
const userRoutes    = require('./routes/userRoutes');
const eventRoutes   = require('./routes/eventRoutes');    // ← make sure path is correct
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();
app.use(cors());
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
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(`Connected to MongoDB: ${mongoose.connection.name}`))
  .catch(err => console.error('MongoDB connection error:', err));

mongoose.connection.on('connected',    () => console.log('Mongoose connected to DB'));
mongoose.connection.on('error',        err => console.error('Mongoose error:', err));
mongoose.connection.on('disconnected', () => console.log('Mongoose disconnected'));

// Central error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Server Error' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

