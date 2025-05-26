// backend/server.js
require('dotenv').config();
const express    = require('express');
const mongoose   = require('mongoose');
const cors       = require('cors');
const cookieParser = require('cookie-parser');
const connectDB  = require('./config/database');

const authRoutes    = require('./routes/authRoutes');
const userRoutes    = require('./routes/userRoutes');
const eventRoutes   = require('./routes/eventRoutes');    // ← make sure path is correct
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();

// CORS configuration
const corsOptions = {
  origin: [process.env.FRONTEND_URL || 'http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Set-Cookie']
};

console.log('[Server] CORS options:', corsOptions);
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parsing middleware
app.use(cookieParser());

// Debug middleware
app.use((req, res, next) => {
  console.log('\n[Server] Request:', {
    method: req.method,
    path: req.path,
    cookies: req.cookies,
    headers: {
      origin: req.headers.origin,
      referer: req.headers.referer,
      cookie: req.headers.cookie
    }
  });
  next();
});

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

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date(),
    cookies: req.cookies,
    headers: {
      origin: req.headers.origin,
      referer: req.headers.referer
    }
  });
});

// Connect to MongoDB
connectDB().catch(err => {
  console.error('[Server] Failed to connect to MongoDB:', err);
  process.exit(1);
});

// Central error handler
app.use((err, req, res, next) => {
  console.error('[Server] Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });
  
  res.status(err.status || 500).json({ 
    success: false, 
    message: err.message || 'Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('\n[Server] Starting up...');
  console.log(`[Server] Running on port ${PORT}`);
  console.log(`[Server] Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`[Server] Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log('[Server] CORS enabled for:', corsOptions.origin);
});


