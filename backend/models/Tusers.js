const mongoose = require('mongoose');

// User Schema for the 'TUsers' collection
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    licenseId: { type: String, required: true },
    transactions: [
        {
            type: { type: String, enum: ['lent', 'received'], required: true },
            amount: { type: Number, required: true },
            date: { type: Date, default: Date.now },
        },
    ],
});

// Switch to the 'transaction' database
const transactionDb = mongoose.connection.useDb('transaction');

// Create the 'TUsers' model in the 'transaction' database
const TUsers = transactionDb.model('TUsers', userSchema, 'TUsers');

// Export the model for use
module.exports = TUsers;
