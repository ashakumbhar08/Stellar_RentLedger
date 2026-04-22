const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Property = require('../models/Property');
const { verifyTransaction } = require('../utils/stellar');

// Record a payment after on-chain transaction
router.post('/record', async (req, res) => {
  try {
    const { propertyId, tenantWallet, txHash, memo, month } = req.body;
    if (!propertyId || !tenantWallet || !txHash) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ error: 'Property not found' });

    // Verify on Stellar
    const txInfo = await verifyTransaction(txHash);
    if (!txInfo.valid) {
      return res.status(400).json({ error: 'Transaction not found on Stellar', detail: txInfo.error });
    }

    // Basic validation
    if (txInfo.from.toLowerCase() !== tenantWallet.toLowerCase()) {
      return res.status(400).json({ error: 'Transaction sender does not match tenant wallet' });
    }

    const payment = await Payment.create({
      propertyId,
      tenantWallet,
      landlordWallet: property.landlordWallet,
      amount: parseFloat(txInfo.amount),
      txHash,
      ledger: txInfo.ledger,
      memo: memo || txInfo.memo,
      month,
      status: 'confirmed',
    });

    res.status(201).json(payment);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'Transaction already recorded' });
    }
    res.status(500).json({ error: err.message });
  }
});

// Get payments for a tenant
router.get('/tenant/:wallet', async (req, res) => {
  try {
    const payments = await Payment.find({ tenantWallet: req.params.wallet })
      .populate('propertyId')
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get payments for a landlord
router.get('/landlord/:wallet', async (req, res) => {
  try {
    const payments = await Payment.find({ landlordWallet: req.params.wallet })
      .populate('propertyId')
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
