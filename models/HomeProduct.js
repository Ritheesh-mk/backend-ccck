const mongoose = require('mongoose');

const homeProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  tamilName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  pricePerKg: {
    type: Number,
    required: true
  },
  weight: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  position: {
    type: Number,
    required: true,
    unique: true,
    min: 1,
    max: 3
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('HomeProduct', homeProductSchema);