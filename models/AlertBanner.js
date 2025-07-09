const mongoose = require('mongoose');

const alertBannerSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true
  },
  couponCode: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  expiresAt: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AlertBanner', alertBannerSchema);