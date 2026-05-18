const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  guestEmail: {
    type: String,
    lowercase: true,
    trim: true
  },
  orderItems: [{
    product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: false },
    name:     { type: String, required: true },
    image:    { type: String, required: true },
    price:    { type: Number, required: true },
    size:     String,
    color:    String,
    quantity: { type: Number, required: true, min: 1 }
  }],
  shippingAddress: {
    fullName:  { type: String, required: true },
    phone:     { type: String, required: true },
    street:    { type: String, required: true },
    city:      { type: String, required: true },
    province:  { type: String, required: true },
    zipCode:   String,
    country:   { type: String, default: 'Pakistan' }
  },
  paymentInfo: {
    method:        { type: String, enum: ['stripe', 'cod', 'jazzcash', 'easypaisa', 'bank_transfer'], default: 'cod' },
    status:        { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
    transactionId: String,
    paidAt:        Date,
    screenshot:    String
  },
  // New top-level payment fields for easier access
  paymentMethod: { type: String, enum: ['cod', 'easypaisa', 'jazzcash', 'bank_transfer'], default: 'cod' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  itemsPrice:    { type: Number, required: true, default: 0 },
  shippingPrice: { type: Number, required: true, default: 0 },
  taxPrice:      { type: Number, required: true, default: 0 },
  totalPrice:    { type: Number, required: true, default: 0 },
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
    default: 'pending'
  },
  trackingNumber: String,
  notes:          String,
  deliveredAt:    Date,
  cancelledAt:    Date,
  cancelReason:   String
}, { timestamps: true });

// Generate order number
orderSchema.pre('save', function(next) {
  if (!this.orderNumber) {
    this.orderNumber = 'KTEX-ORD-' + Date.now();
  }
  next();
});

orderSchema.add({ orderNumber: { type: String, unique: true } });

module.exports = mongoose.model('Order', orderSchema);
