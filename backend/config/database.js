const mongoose = require('mongoose');
require('dotenv').config();  // Load environment variables

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ MongoDB Connected...');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error);
        process.exit(1);
    }
}

module.exports = connectDB; // Export the function so it can be used in server.js