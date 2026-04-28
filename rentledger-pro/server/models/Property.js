const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    landlordWallet: { type: String, required: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    rentAmount: { type: Number, required: true }, // in XLM
    description: { type: String },
    paymentLink: { type: String, unique: true }, // UUID-based shareable link
  },
  { timestamps: true }
);

module.exports = mongoose.model('Property', propertySchema);
