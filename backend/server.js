// backend/server.js
require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');

const authRoutes    = require('./routes/authRoutes');
const userRoutes    = require('./routes/userRoutes');
const eventRoutes   = require('./routes/eventRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Health‑check (for curl / browser)
app.get('/health', (req, res) => res.send('OK'));

// Mount all routers under /api/v1
app.use('/api/v1',         authRoutes);
app.use('/api/v1/users',   userRoutes);
app.use('/api/v1/events',  eventRoutes);
app.use('/api/v1/bookings',bookingRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(`Connected to MongoDB: ${mongoose.connection.name}`))
  .catch(err => console.error('MongoDB connection error:', err));

mongoose.connection.on('connected',    () => console.log('Mongoose connected to DB'));
mongoose.connection.on('error',        err => console.error('Mongoose error:', err));
mongoose.connection.on('disconnected', () => console.log('Mongoose disconnected'));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
