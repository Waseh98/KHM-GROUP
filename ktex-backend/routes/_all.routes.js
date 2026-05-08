// ─── order.routes.js ──────────────────────────────────────────────────────────
const express = require('express');
const orderRouter = express.Router();
const { createOrder, getMyOrders, getOrderById, cancelOrder, getAllOrders, updateOrderStatus } = require('../controllers/order.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

orderRouter.post('/',              protect, createOrder);
orderRouter.get('/my-orders',      protect, getMyOrders);
orderRouter.get('/:id',            protect, getOrderById);
orderRouter.put('/:id/cancel',     protect, cancelOrder);
orderRouter.get('/',               protect, adminOnly, getAllOrders);
orderRouter.put('/:id/status',     protect, adminOnly, updateOrderStatus);

// ─── payment.routes.js ────────────────────────────────────────────────────────
const paymentRouter = express.Router();
const { createPaymentIntent, confirmPayment, stripeWebhook, refundPayment } = require('../controllers/payment.controller');

paymentRouter.post('/create-intent', protect, createPaymentIntent);
paymentRouter.post('/confirm',       protect, confirmPayment);
paymentRouter.post('/webhook',       express.raw({ type: 'application/json' }), stripeWebhook);
paymentRouter.post('/refund',        protect, adminOnly, refundPayment);

// ─── review.routes.js ─────────────────────────────────────────────────────────
const reviewRouter = express.Router();
const { createReview, getProductReviews, updateReview, deleteReview, markHelpful } = require('../controllers/review.controller');

reviewRouter.post('/:productId',         protect, createReview);
reviewRouter.get('/:productId',          getProductReviews);
reviewRouter.put('/:id',                 protect, updateReview);
reviewRouter.delete('/:id',             protect, deleteReview);
reviewRouter.put('/:id/helpful',         protect, markHelpful);

// ─── user.routes.js ───────────────────────────────────────────────────────────
const userRouter = express.Router();
userRouter.get('/profile', protect, (req, res) => {
  res.status(200).json({ success: true, data: req.user });
});

// ─── admin.routes.js ──────────────────────────────────────────────────────────
const adminRouter = express.Router();
const { getDashboardStats, getAllUsers, updateUserRole, deleteUser, getAllReviews, approveReview } = require('../controllers/admin.controller');
const { protect: p, adminOnly: ao } = require('../middleware/auth.middleware');

adminRouter.use(p, ao); // All admin routes are protected

adminRouter.get('/dashboard',           getDashboardStats);
adminRouter.get('/users',               getAllUsers);
adminRouter.put('/users/:id',           updateUserRole);
adminRouter.delete('/users/:id',        deleteUser);
adminRouter.get('/reviews',             getAllReviews);
adminRouter.put('/reviews/:id/approve', approveReview);

module.exports = { orderRouter, paymentRouter, reviewRouter, userRouter, adminRouter };
