const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    tenantWallet: { type: String, required: true },
    landlordWallet: { type: String, required: true },
    amount: { type: Number, required: true },
    txHash: { type: String, required: true, unique: true },
    ledger: { type: Number },
    memo: { type: String },
    month: { type: String }, // e.g. "2024-01"
    status: { type: String, enum: ['pending', 'confirmed', 'failed'], default: 'pending' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
