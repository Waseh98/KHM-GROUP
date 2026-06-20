const express = require('express');
const router  = express.Router();
const { protect, optionalProtect, adminOnly } = require('../middleware/auth.middleware');
const { createOrder, createGuestOrder, getMyOrders, getOrderById, cancelOrder, getAllOrders, updateOrderStatus, trackOrder, deleteOrder } = require('../controllers/order.controller');

router.post('/',           protect, createOrder);
router.post('/guest',      optionalProtect, createGuestOrder);
router.get('/track/:trackingId', trackOrder);
router.get('/my-orders',   protect, getMyOrders);
router.get('/:id',         protect, getOrderById);
router.put('/:id/cancel',  protect, cancelOrder);
router.get('/',            protect, adminOnly, getAllOrders);
router.put('/:id/status',  protect, adminOnly, updateOrderStatus);
router.delete('/:id',      protect, adminOnly, deleteOrder);

module.exports = router;
