const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ====== Multer Storage Setup ======
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/blogs');
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

// ====== Serve Uploaded Files (Optional) ======
router.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ====== GET All Blogs ======
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ====== POST New Blog ======
router.post('/', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, description, content, category, products } = req.body;

   if (!title || !category) {
  return res.status(400).json({ message: 'Title and category are required' });
}

    const newBlog = new Blog({
  title,
  category,
  video: req.files?.video?.[0] ? `/uploads/blogs/${req.files.video[0].filename}` : null,
});


    const saved = await newBlog.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: 'Failed to save blog', error: err.message });
  }
});

// ====== PUT Update Blog ======
router.put('/:id', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, description, content, category, products } = req.body;
    const updateData = {
      title,
      description,
      content,
      category,
      products: Array.isArray(products) ? products : JSON.parse(products || '[]')
    };

    const existing = await Blog.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Blog not found' });

    // Delete old video if replaced
    if (req.files?.video?.[0]) {
      if (existing.video) {
        const oldVideo = path.join(__dirname, `../${existing.video}`);
        if (fs.existsSync(oldVideo)) fs.unlinkSync(oldVideo);
      }
      updateData.video = `/uploads/blogs/${req.files.video[0].filename}`;
    }

    // Delete old image if replaced
    if (req.files?.image?.[0]) {
      if (existing.image) {
        const oldImage = path.join(__dirname, `../${existing.image}`);
        if (fs.existsSync(oldImage)) fs.unlinkSync(oldImage);
      }
      updateData.image = `/uploads/blogs/${req.files.image[0].filename}`;
    }

    const updated = await Blog.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ====== DELETE Blog ======
router.delete('/:id', async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    // Delete associated video
    if (blog.video) {
      const videoPath = path.join(__dirname, `../${blog.video}`);
      if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
    }

    // Delete associated image
    if (blog.image) {
      const imagePath = path.join(__dirname, `../${blog.image}`);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
