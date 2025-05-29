// .env example:
// MONGODB_URI=your_mongodb_connection_string
// EMAIL_USER=your_gmail_address
// EMAIL_PASS=your_gmail_app_password
// JWT_SECRET=your_jwt_secret

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Always use the provided Atlas connection string
const MONGODB_URI = process.env.MONGODB_URI;

const connectDB = async () => {
    try {
        if (!MONGODB_URI) {
            console.error('MONGODB_URI not set in .env');
            throw new Error('MONGODB_URI environment variable not set');
        }
        const conn = await mongoose.connect(MONGODB_URI);
        console.log('✅ MongoDB Connected...');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB; // Export the function so it can be used in server.js