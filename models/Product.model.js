const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  discountPrice: {
    type: Number,
    default: 0
  },
  pageType: {
    type: String,
    required: [true, 'Page type is required'],
    enum: ['Men', 'Women', 'Kids', 'Mens', 'Sale'],
    trim: true,
    set: v => v === 'Mens' ? 'Men' : v
  },
  mainCategory: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    trim: true
  },
  subCategory: {
    type: String,
    trim: true
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, 'Stock cannot be negative']
  },
  productStatus: {
    type: String,
    enum: ['active', 'draft', 'archived'],
    default: 'active'
  },
  images: [{
    public_id: String,
    url: { type: String, required: true }
  }],
  sizes: [{
    size:  { type: String, enum: ['XS','S','M','L','XL','XXL','3XL','Custom'] },
    stock: { type: Number, default: 0 }
  }],
  colors: [{
    name: String,
    hexCode: String
  }],
  fabric:   String,
  brand:    { type: String, default: 'K-TEX' },
  sku:      { type: String, unique: true },
  tags:     [String],
  ratings:  { type: Number, default: 0 },
  numOfReviews: { type: Number, default: 0 },
  isFeatured:   { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  isFreeDelivery: { type: Boolean, default: false },
  isActive:     { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// Virtual for discount percentage
productSchema.virtual('discountPercent').get(function() {
  if (!this.discountPrice || this.discountPrice === 0) return 0;
  return Math.round(((this.price - this.discountPrice) / this.price) * 100);
});

// Auto-generate SKU
productSchema.pre('save', function(next) {
  if (!this.sku) {
    this.sku = 'KTEX-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
  }
  next();
});

productSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
