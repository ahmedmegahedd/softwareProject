const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Always use the provided Atlas connection string
const MONGODB_URI = 'mongodb+srv://loaimohamedfarrag:Mongo%40SW25@cluster0.lymhh.mongodb.net/Software?retryWrites=true&w=majority';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(MONGODB_URI);
        console.log('✅ MongoDB Connected...');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB; // Export the function so it can be used in server.js