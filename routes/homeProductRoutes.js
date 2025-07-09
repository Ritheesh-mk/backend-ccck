const express = require('express');
const router = express.Router();
const HomeProduct = require('../models/HomeProduct');
const multer = require('multer');
const path = require('path');

// Configure storage for product images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/home-products/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.match(/^image\/(jpeg|jpg|png|gif)$/)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Get all home products (only 3)
router.get('/', async (req, res) => {
  try {
    const products = await HomeProduct.find().sort('position').limit(3);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new home product
router.post('/', upload.single('image'), async (req, res) => {
  try {
    // Check if position is between 1-3
    if (req.body.position < 1 || req.body.position > 3) {
      return res.status(400).json({ message: 'Position must be between 1 and 3' });
    }

    // Check if position is already taken
    const existingProduct = await HomeProduct.findOne({ position: req.body.position });
    if (existingProduct) {
      return res.status(400).json({ message: 'Position already occupied' });
    }

    const product = new HomeProduct({
      name: req.body.name,
      tamilName: req.body.tamilName,
      description: req.body.description,
      image: req.file ? req.file.path : '',
      price: req.body.price,
      pricePerKg: req.body.pricePerKg,
      weight: req.body.weight,
      rating: req.body.rating,
      position: req.body.position
    });

    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update home product
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const product = await HomeProduct.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update fields
    product.name = req.body.name || product.name;
    product.tamilName = req.body.tamilName || product.tamilName;
    product.description = req.body.description || product.description;
    product.price = req.body.price || product.price;
    product.pricePerKg = req.body.pricePerKg || product.pricePerKg;
    product.weight = req.body.weight || product.weight;
    product.rating = req.body.rating || product.rating;
    
    if (req.file) {
      product.image = req.file.path;
    }

    // Handle position change
    if (req.body.position && req.body.position !== product.position) {
      if (req.body.position < 1 || req.body.position > 3) {
        return res.status(400).json({ message: 'Position must be between 1 and 3' });
      }

      // Swap positions if needed
      const existingProduct = await HomeProduct.findOne({ position: req.body.position });
      if (existingProduct) {
        existingProduct.position = product.position;
        await existingProduct.save();
      }

      product.position = req.body.position;
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete home product
router.delete('/:id', async (req, res) => {
  try {
    const product = await HomeProduct.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;