const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order  = require('../models/Order.model');

// @POST /api/payment/create-intent
// Creates Stripe payment intent — frontend uses client_secret to confirm
exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency = 'pkr', orderId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount:   Math.round(amount * 100), // Stripe uses smallest currency unit
      currency,
      metadata: { orderId: orderId || '', userId: req.user._id.toString(), brand: 'K-TEX' }
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @POST /api/payment/confirm
// Called after frontend confirms payment with Stripe
exports.confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId, orderId } = req.body;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ success: false, message: 'Payment not successful' });
    }

    // Update order payment status
    const order = await Order.findByIdAndUpdate(orderId, {
      'paymentInfo.status':        'paid',
      'paymentInfo.transactionId': paymentIntentId,
      'paymentInfo.paidAt':        Date.now(),
      'paymentInfo.method':        'stripe',
      orderStatus:                 'confirmed'
    }, { new: true });

    res.status(200).json({
      success: true,
      message: 'Payment confirmed successfully!',
      data: order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @POST /api/payment/webhook — Stripe webhook listener
exports.stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).json({ success: false, message: `Webhook Error: ${err.message}` });
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const { orderId } = paymentIntent.metadata;
    if (orderId) {
      await Order.findByIdAndUpdate(orderId, {
        'paymentInfo.status': 'paid',
        'paymentInfo.transactionId': paymentIntent.id,
        'paymentInfo.paidAt': new Date(paymentIntent.created * 1000),
        orderStatus: 'confirmed'
      });
    }
  }

  if (event.type === 'payment_intent.payment_failed') {
    const paymentIntent = event.data.object;
    const { orderId } = paymentIntent.metadata;
    if (orderId) {
      await Order.findByIdAndUpdate(orderId, { 'paymentInfo.status': 'failed' });
    }
  }

  res.json({ received: true });
};

// @POST /api/payment/refund — Admin only
exports.refundPayment = async (req, res) => {
  try {
    const { transactionId, amount, orderId } = req.body;
    const refund = await stripe.refunds.create({
      payment_intent: transactionId,
      amount: amount ? Math.round(amount * 100) : undefined // undefined = full refund
    });

    await Order.findByIdAndUpdate(orderId, { 'paymentInfo.status': 'refunded' });

    res.status(200).json({ success: true, message: 'Refund processed', data: refund });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
