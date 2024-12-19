const mongoose = require('mongoose');

// Define the product schema
const productSchema = new mongoose.Schema({
  product_name: {
    type: String,
    required: true
  },
  mrp: {
    type: Number,
    required: true
  },
  gst_rate: {
    type: Number,
    required: true,
    enum: [12, 18]  // Only allow GST rates of 12 or 18
  },
  barcode_number: {
    type: String,
    required: true,
    unique: true
  }
}, { timestamps: true });

// Create and export the Product model
module.exports = mongoose.model('Product', productSchema);
