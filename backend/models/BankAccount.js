const mongoose = require('mongoose');

const bankAccountSchema = new mongoose.Schema({
  name: { type: String, required: true },
  balance: { type: Number, required: true },
});

module.exports = mongoose.model('BankAccount', bankAccountSchema);
