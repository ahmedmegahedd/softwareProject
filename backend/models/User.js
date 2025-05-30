const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'organizer', 'admin'], default: 'user' },
  resetOTP: { type: String },
  resetOTPExpiry: { type: Date },
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Always store role in lowercase
UserSchema.pre('save', function(next) {
  if (this.role) {
    this.role = this.role.toLowerCase();
  }
  next();
});

module.exports = mongoose.model('User', UserSchema);