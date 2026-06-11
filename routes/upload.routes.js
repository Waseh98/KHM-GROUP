const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth.middleware');
const {
  getUploadStatus,
  uploadImage,
  uploadImages,
  uploadPaymentProof,
} = require('../controllers/upload.controller');

const guestUploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many uploads. Please try again later.' },
});

router.get('/status', getUploadStatus);
router.post('/payment-proof', guestUploadLimiter, uploadPaymentProof);
router.post('/', protect, adminOnly, uploadImage);
router.post('/batch', protect, adminOnly, uploadImages);

module.exports = router;
