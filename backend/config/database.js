const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const connectDB = async () => {
    try {
        // Use local MongoDB connection
        const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/event_management';
        
        const conn = await mongoose.connect(MONGODB_URI);
        console.log('✅ MongoDB Connected...');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB; // Export the function so it can be used in server.js