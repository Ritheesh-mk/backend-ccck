const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    trim: true
  },
  image: {
    type: String
  },
  packaging:  {
    type: [String],
    trim: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  reviews: {
    type: Number,
    min: 0
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);

