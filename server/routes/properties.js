const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Property = require('../models/Property');

// Create a property
router.post('/', async (req, res) => {
  try {
    const { landlordWallet, name, address, rentAmount, description } = req.body;
    if (!landlordWallet || !name || !address || !rentAmount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const paymentLink = uuidv4();
    const property = await Property.create({
      landlordWallet,
      name,
      address,
      rentAmount,
      description,
      paymentLink,
    });
    res.status(201).json(property);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all properties for a landlord wallet
router.get('/landlord/:wallet', async (req, res) => {
  try {
    const properties = await Property.find({ landlordWallet: req.params.wallet });
    res.json(properties);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get property by payment link
router.get('/link/:paymentLink', async (req, res) => {
  try {
    const property = await Property.findOne({ paymentLink: req.params.paymentLink });
    if (!property) return res.status(404).json({ error: 'Property not found' });
    res.json(property);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get property by ID
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ error: 'Property not found' });
    res.json(property);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
