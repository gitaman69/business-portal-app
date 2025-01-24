const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['Credit', 'Debit'], required: true },
  mode: { type: String, required: true },
  account: { type: String, required: true },
  netBalance: { type: Number, default: 0 },
});

module.exports = mongoose.model('Transaction', transactionSchema);
