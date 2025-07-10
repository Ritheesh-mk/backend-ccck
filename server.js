const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Create uploads directories if needed
const uploadsDir = path.join(__dirname, 'uploads');
const homeProductsDir = path.join(uploadsDir, 'home-products');
if (!fs.existsSync(homeProductsDir)) {
  fs.mkdirSync(homeProductsDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded images
app.use('/uploads', express.static(uploadsDir));
app.use('/uploads', express.static('uploads'));
// Routes
const blogRoutes = require('./routes/blogRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const productRoutes = require('./routes/products');
const alertBannerRoutes = require('./routes/alertBannerRoutes');
const homeProductRoutes = require('./routes/homeProductRoutes');

app.use('/api/blogs', blogRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/products', productRoutes);
app.use('/api/alert-banner', alertBannerRoutes);
app.use('/api/home-products', homeProductRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB connected');
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});