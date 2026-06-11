const path = require('path');
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

if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
    console.log('Firebase Admin initialized');
  } catch (error) {
    console.error('Firebase Admin error:', error.message);
  }
}

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(morgan('dev'));

const corsAllowed = new Set([
  'http://localhost:5173',
  process.env.CLIENT_URL,
  'https://ktexstore.com',
  'http://ktexstore.com',
  'https://www.ktexstore.com',
  'http://www.ktexstore.com',
].filter(Boolean));

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (corsAllowed.has(origin)) return cb(null, true);
    if (origin.includes('ktexstore.com') || origin.includes('vercel.app')) return cb(null, true);
    return cb(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later.' },
}));

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/orders', require('./routes/order.routes'));
app.use('/api/payment', require('./routes/payment.routes'));
app.use('/api/reviews', require('./routes/review.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/categories', require('./routes/category.routes'));
app.use('/api/collections', require('./routes/collection.routes'));
app.use('/api/upload', require('./routes/upload.routes'));

app.get('/api/health', (req, res) => {
  const { isConfigured } = require('./utils/cloudinary');
  res.json({
    success: true,
    message: 'K-TEX API is running!',
    version: '1.0.0',
    status: 'online',
    cloudinary: isConfigured(),
  });
});

app.use('/api', (req, res) => {
  res.status(404).json({ success: false, message: `API Route ${req.originalUrl} not found` });
});

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5001;

mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 })
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, '0.0.0.0', () => console.log(`API running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB failed:', err.message);
    process.exit(1);
  });

module.exports = app;
