const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const app = express();
app.set('trust proxy', 1);

// ─── Middleware ───────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(morgan('dev'));
const corsAllowed = new Set(
  ['http://localhost:5173', 'http://localhost:5174', process.env.CLIENT_URL, 'https://ktexstore.com', 'http://ktexstore.com'].filter(Boolean)
);
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (corsAllowed.has(origin)) return cb(null, true);
    if (origin && (origin.endsWith('.ktexstore.com') || origin.includes('ktexstore.com'))) return cb(null, true);
    return cb(null, false);
  },
  credentials: true
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// ─── Routes ───────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/orders', require('./routes/order.routes'));
app.use('/api/payment', require('./routes/payment.routes'));
app.use('/api/reviews', require('./routes/review.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/categories', require('./routes/category.routes'));
app.use('/api/collections', require('./routes/collection.routes'));

// ─── Health Check ─────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '🏆 K-TEX API is running!',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      products: '/api/products',
      orders: '/api/orders',
      payment: '/api/payment',
      reviews: '/api/reviews',
      admin: '/api/admin',
      categories: '/api/categories',
      collections: '/api/collections'
    }
  });
});

// ─── API 404 Handler ──────────────────────────────────────
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, message: `API Route ${req.originalUrl} not found` });
});

// ─── Serve Uploaded Images ─────────────────────────────────
const path = require('path');
const fs = require('fs');
const { uploadDir } = require('./utils/imageUploader');
app.get('/uploads/:filename', (req, res) => {
  const filename = path.basename(req.params.filename);
  const filePath = path.join(uploadDir, filename);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ success: false, message: 'Image not found' });
  }
});

// ─── Serve Frontend in Production ──────────────────────────
function findDistPath() {
  const candidates = [
    path.join(__dirname, '..', 'dist'),
    path.join(__dirname, '..', '..', 'dist'),
    path.join(__dirname, 'dist'),
    path.join(__dirname, '..', 'public', 'dist'),
    path.join(process.cwd(), 'dist'),
  ];
  for (const p of candidates) {
    if (fs.existsSync(path.join(p, 'index.html'))) {
      console.log('📁 Serving frontend from:', p);
      return p;
    }
  }
  console.warn('⚠️  dist/index.html not found. Attempted paths:', candidates);
  return candidates[0];
}
const clientDistPath = findDistPath();
app.use(express.static(clientDistPath));

app.get('*', (req, res) => {
  const htmlPath = path.join(clientDistPath, 'index.html');
  if (fs.existsSync(htmlPath)) {
    res.sendFile(htmlPath);
  } else {
    res.status(200).send(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>K-TEX</title></head><body><div id="root"></div><script>console.warn('dist/index.html not found at ${htmlPath.replace(/\\/g, '\\\\')}');</script></body></html>`);
  }
});

// ─── Global Error Handler ─────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// ─── Database + Start ─────────────────────────────────────

const PORT = process.env.PORT || 3000;



mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 })
  .then(() => {
    console.log('✅ MongoDB Connected');
    // Start server only after DB is ready
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 K-TEX Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
  });

module.exports = app;
