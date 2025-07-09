const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  position: {
    type: String,
    trim: true
  },
  business: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  avatar: String,
  products: [String]
}, {
  timestamps: true
});

module.exports = mongoose.model('Testimonial', testimonialSchema);