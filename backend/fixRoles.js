const mongoose = require('mongoose');
const User = require('./models/User');

// Replace with your actual MongoDB connection string if needed
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/Software';

mongoose.connect(MONGO_URI)
  .then(async () => {
    await User.updateMany({ role: "User" }, { $set: { role: "user" } });
    await User.updateMany({ role: "Organizer" }, { $set: { role: "organizer" } });
    await User.updateMany({ role: "Admin" }, { $set: { role: "admin" } });
    console.log('Roles updated!');
    process.exit();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }); 