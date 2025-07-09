const express = require('express');
const router = express.Router();
const AlertBanner = require('../models/AlertBanner');

// Get active alert banner
router.get('/', async (req, res) => {
  try {
    const banner = await AlertBanner.findOne({ isActive: true });
    res.json(banner || {});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create or update alert banner
router.post('/', async (req, res) => {
  try {
    // Deactivate all existing banners
    await AlertBanner.updateMany({}, { $set: { isActive: false } });

    const banner = new AlertBanner({
      message: req.body.message,
      couponCode: req.body.couponCode,
      expiresAt: new Date(req.body.expiresAt),
      isActive: true
    });

    const savedBanner = await banner.save();
    res.status(201).json(savedBanner);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Deactivate alert banner
router.delete('/', async (req, res) => {
  try {
    await AlertBanner.updateMany({}, { $set: { isActive: false } });
    res.json({ message: 'Alert banner deactivated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;