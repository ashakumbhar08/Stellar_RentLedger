const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');

// Get receipt by txHash
router.get('/:txHash', async (req, res) => {
  try {
    const payment = await Payment.findOne({ txHash: req.params.txHash }).populate('propertyId');
    if (!payment) return res.status(404).json({ error: 'Receipt not found' });
    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all receipts for a property
router.get('/property/:propertyId', async (req, res) => {
  try {
    const payments = await Payment.find({ propertyId: req.params.propertyId })
      .populate('propertyId')
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
