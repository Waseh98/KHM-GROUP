const Order = require('../models/Order.model');
const Product = require('../models/Product.model');
const { processImage, FOLDERS } = require('../utils/imageUploader');
const { sendOrderConfirmationEmail } = require('../utils/emailService');
const { sendWhatsAppOrderConfirmation } = require('../utils/whatsappService');

// @POST /api/orders
exports.createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentInfo, notes } = req.body;

    if (!orderItems?.length) {
      return res.status(400).json({ success: false, message: 'No order items provided' });
    }

    // Calculate prices
    let itemsPrice = 0;
    let shippingPrice = 0;
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) return res.status(404).json({ success: false, message: `Product ${item.product} not found` });
      const unitPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
      itemsPrice += unitPrice * item.quantity;
      
      // Calculate shipping based on the product isFreeDelivery option
      if (!product.isFreeDelivery) {
        shippingPrice += 300 * item.quantity;
      }
    }

    const taxPrice      = 0; // 5% tax removed
    const totalPrice    = itemsPrice + shippingPrice + taxPrice;

    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentInfo,
      paymentMethod: paymentInfo?.method || 'cod',
      paymentStatus: paymentInfo?.status || 'pending',
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      notes
    });

    // Send order confirmation email (non-blocking)
    const userEmail = req.user?.email || order.guestEmail;
    const userName  = req.user?.name  || order.shippingAddress?.fullName || 'Valued Customer';
    sendOrderConfirmationEmail(order, userEmail, userName).catch(err =>
      console.error('[Email] Confirmation send failed:', err.message)
    );

    // Send WhatsApp order confirmation (non-blocking)
    const userPhone = req.user?.phone || order.shippingAddress?.phone || order.shippingAddress?.whatsapp;
    sendWhatsAppOrderConfirmation(order, userPhone, userName).catch(err =>
      console.error('[WhatsApp] Confirmation send failed:', err.message)
    );

    res.status(201).json({ success: true, message: 'Order placed successfully!', data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @POST /api/orders/guest — Guest checkout (no login)
exports.createGuestOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentInfo, notes, email, paymentScreenshot } = req.body;

    if (!orderItems?.length) {
      return res.status(400).json({ success: false, message: 'No order items provided' });
    }

    // Guest checkout: frontend may not have Mongo product ids yet.
    // We accept price/qty from payload and compute totals.
    let itemsPrice = 0;
    let shippingPrice = 0;
    for (const item of orderItems) {
      if (!item?.name || !item?.image || typeof item?.price !== 'number' || !item?.quantity) {
        return res.status(400).json({ success: false, message: 'Invalid order item payload' });
      }
      itemsPrice += item.price * Number(item.quantity);

      // Query Product to check if it has free delivery
      const product = await Product.findById(item.product);
      if (product) {
        if (!product.isFreeDelivery) {
          shippingPrice += 300 * Number(item.quantity);
        }
      } else {
        // Fallback default shipping if product is not found in database
        shippingPrice += 300 * Number(item.quantity);
      }
    }

    const taxPrice      = 0; // 5% tax removed
    const totalPrice    = itemsPrice + shippingPrice + taxPrice;

    // Store payment screenshot in MongoDB as base64 or URL
    let screenshotUrl = '';
    if (paymentScreenshot) {
      try {
        screenshotUrl = await processImage(paymentScreenshot, FOLDERS.orders);
      } catch (e) {
        console.error('Screenshot save failed:', e.message);
      }
    }

    const order = await Order.create({
      user: req.user?._id || null,
      guestEmail: req.user ? req.user.email : email,
      orderItems,
      shippingAddress,
      paymentInfo: {
        ...(paymentInfo || {}),
        method: paymentInfo?.method || 'cod',
        status: paymentInfo?.status || 'pending',
        screenshot: screenshotUrl
      },
      paymentMethod: paymentInfo?.method || 'cod',
      paymentStatus: paymentInfo?.status || 'pending',
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      notes
    });

    // Send order confirmation email (non-blocking)
    const guestEmail = email || order.guestEmail;
    const guestName  = shippingAddress?.fullName || 'Valued Customer';
    sendOrderConfirmationEmail(order, guestEmail, guestName).catch(err =>
      console.error('[Email] Guest confirmation send failed:', err.message)
    );

    // Send WhatsApp order confirmation (non-blocking)
    const guestPhone = shippingAddress?.phone || shippingAddress?.whatsapp;
    sendWhatsAppOrderConfirmation(order, guestPhone, guestName).catch(err =>
      console.error('[WhatsApp] Guest confirmation send failed:', err.message)
    );

    res.status(201).json({ success: true, message: 'Order placed successfully!', data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/orders/my-orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('orderItems.product', 'name images')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/orders/:id
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('orderItems.product', 'name images price');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @PUT /api/orders/:id/cancel
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.user && order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    if (!['pending', 'confirmed'].includes(order.orderStatus)) {
      return res.status(400).json({ success: false, message: 'Cannot cancel order at this stage' });
    }
    order.orderStatus  = 'cancelled';
    order.cancelledAt  = Date.now();
    order.cancelReason = req.body.reason || 'Cancelled by user';
    await order.save();
    res.status(200).json({ success: true, message: 'Order cancelled successfully', data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/orders — Admin: all orders
exports.getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = status ? { orderStatus: status } : {};
    const skip  = (Number(page) - 1) * Number(limit);
    const total  = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip).limit(Number(limit));

    res.status(200).json({ success: true, count: orders.length, total, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @PUT /api/orders/:id/status — Admin
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingNumber } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.orderStatus = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (status === 'delivered') order.deliveredAt = Date.now();
    await order.save();

    res.status(200).json({ success: true, message: `Order status updated to ${status}`, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/orders/track/:trackingId — Public order tracking
exports.trackOrder = async (req, res) => {
  try {
    const trackingId = String(req.params.trackingId || '').trim();
    if (!trackingId) {
      return res.status(400).json({ success: false, message: 'Tracking ID is required' });
    }

    const order = await Order.findOne({
      $or: [
        { orderNumber: trackingId },
        { trackingNumber: trackingId },
      ],
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found for this tracking ID' });
    }

    res.status(200).json({
      success: true,
      data: {
        orderNumber: order.orderNumber,
        trackingNumber: order.trackingNumber || null,
        orderStatus: order.orderStatus,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        deliveredAt: order.deliveredAt || null,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @DELETE /api/orders/:id — Admin: permanently delete an order
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
