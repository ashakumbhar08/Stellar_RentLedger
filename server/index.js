require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const propertyRoutes = require('./routes/properties');
const paymentRoutes = require('./routes/payments');
const receiptRoutes = require('./routes/receipts');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/properties', propertyRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/receipts', receiptRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/rentledger';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('MongoDB connection error:', err));
