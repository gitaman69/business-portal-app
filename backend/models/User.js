const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  licenseId: { type: String, required: true, unique: true }, // New field
});

module.exports = mongoose.model('User', userSchema);
