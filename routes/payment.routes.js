const express = require('express');
const router  = express.Router();
const { protect, adminOnly } = require('../middleware/auth.middleware');
const { createPaymentIntent, confirmPayment, stripeWebhook, refundPayment } = require('../controllers/payment.controller');

router.post('/create-intent', protect, createPaymentIntent);
router.post('/confirm',       protect, confirmPayment);
router.post('/webhook',       express.raw({ type: 'application/json' }), stripeWebhook);
router.post('/refund',        protect, adminOnly, refundPayment);

module.exports = router;
