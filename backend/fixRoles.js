const mongoose = require('mongoose');
const User = require('./models/User');

// Always use the provided Atlas connection string
const MONGO_URI = 'mongodb+srv://loaimohamedfarrag:Mongo%40SW25@cluster0.lymhh.mongodb.net/Software?retryWrites=true&w=majority';

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