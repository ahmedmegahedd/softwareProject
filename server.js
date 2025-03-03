const express = require('express');
const connectDB = require('./config/database'); // Import database connection function

const app = express();
app.use(express.json());

connectDB(); // Call the database connection function

app.listen(5000, () => console.log('🚀 Server running on port 5000'));