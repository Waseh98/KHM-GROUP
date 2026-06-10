const path = require('path');
const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const admin = require('firebase-admin');

const app = express();
app.set('trust proxy', 1);

// Initialize Firebase Admin SDK if credentials are provided in .env
if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
    console.log('🔥 Firebase Admin SDK Initialized Successfully');
  } catch (error) {
    console.error('❌ Firebase Admin SDK Initialization Error:', error.message);
  }
} else {
  console.warn('⚠️ Firebase Admin credentials missing in .env. Google admin login will not work until FIREBASE_* vars are set.');
}

// ─── Middleware ───────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' }
}));
app.use(morgan('dev'));

const corsAllowed = new Set([
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  process.env.CLIENT_URL,
  'https://ktexstore.com',
  'http://ktexstore.com',
  'https://www.ktexstore.com',
  'http://www.ktexstore.com'
].filter(Boolean));

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (corsAllowed.has(origin)) return cb(null, true);
    if (origin && origin.includes('ktexstore.com')) return cb(null, true);
    return cb(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'X-Requested-With']
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
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
    status: 'online',
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
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

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

// SPA fallback — never intercept API or uploads
app.get(/^(?!\/api|\/uploads).*/, (req, res) => {
  const htmlPath = path.join(clientDistPath, 'index.html');
  if (fs.existsSync(htmlPath)) {
    return res.sendFile(htmlPath);
  }
  res.status(503).send('Frontend build not found. Run npm run build first.');
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

const PORT = process.env.PORT || 5001;



mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 })
  .then(() => {
    console.log('✅ MongoDB Connected');
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 K-TEX Server running on port ${PORT}`);
    });
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use. Stop the other process or set PORT in .env`);
      } else {
        console.error('❌ Server failed to start:', err.message);
      }
      process.exit(1);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });

module.exports = app;
