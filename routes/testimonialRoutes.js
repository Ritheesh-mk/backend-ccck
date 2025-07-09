const express = require('express');
const router = express.Router();
const Testimonial = require('../models/Testimonial');
const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
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

// GET all testimonials
router.get('/', async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new testimonial
router.post('/', upload.single('avatar'), async (req, res) => {
  const { name, content, rating } = req.body;
  
  if (!name || !content || !rating) {
    return res.status(400).json({ message: 'Name, content, and rating are required.' });
  }
  
  const testimonial = new Testimonial({
    name,
    position: req.body.position,
    business: req.body.business,
    location: req.body.location,
    content,
    rating,
    products: req.body.products ? JSON.parse(req.body.products) : [],
    avatar: req.file ? req.file.path : null
  });

  try {
    const newTestimonial = await testimonial.save();
    res.status(201).json(newTestimonial);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update testimonial
router.put('/:id', upload.single('avatar'), async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    testimonial.name = req.body.name || testimonial.name;
    testimonial.position = req.body.position || testimonial.position;
    testimonial.business = req.body.business || testimonial.business;
    testimonial.location = req.body.location || testimonial.location;
    testimonial.content = req.body.content || testimonial.content;
    testimonial.rating = req.body.rating || testimonial.rating;
    
    if (req.body.products) {
      testimonial.products = JSON.parse(req.body.products);
    }
    
    if (req.file) {
      testimonial.avatar = req.file.path;
    }

    const updatedTestimonial = await testimonial.save();
    res.json(updatedTestimonial);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE testimonial
router.delete('/:id', async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    await testimonial.deleteOne();
    res.json({ message: 'Testimonial deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;