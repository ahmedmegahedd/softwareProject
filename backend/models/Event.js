const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  ticketsAvailable: { type: Number, required: true },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['approved', 'pending', 'declined'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);