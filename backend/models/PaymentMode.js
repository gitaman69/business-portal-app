const mongoose = require('mongoose');

const paymentModeSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

module.exports = mongoose.model('PaymentMode', paymentModeSchema);