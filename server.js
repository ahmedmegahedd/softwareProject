require('dotenv').config();  // Load environment variables
const express = require('express');
const connectDB = require('./config/database');

const app = express();

// Connect to MongoDB
connectDB();

app.get('/', (req, res) => {
    res.send('Server is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
