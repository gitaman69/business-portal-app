const mongoose = require('mongoose');

// BillData Schema
const billDataSchema = new mongoose.Schema({
  storeName: {
    type: String,
    required: true,
  },
  storeMail: {
    type: String,
    required: true,
  },
  storeContact: {
    type: String,
    required: true,
  },
  storeAddress: {
    type: String,
    required: true,
  },
});

const BillData = mongoose.model('BillData', billDataSchema);
module.exports = BillData;
