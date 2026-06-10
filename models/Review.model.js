const mongoose = require('mongoose');
const Product = require('./Product.model');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5
  },
  title:   { type: String, maxlength: 100 },
  comment: { type: String, required: [true, 'Review comment is required'], maxlength: 1000 },
  images:  [{ public_id: String, url: String }],
  isVerifiedPurchase: { type: Boolean, default: false },
  helpful: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isApproved: { type: Boolean, default: true }
}, { timestamps: true });

// One review per user per product
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

// Update product ratings after review save
reviewSchema.statics.calcAverageRatings = async function(productId) {
  const stats = await this.aggregate([
    { $match: { product: productId, isApproved: true } },
    { $group: { _id: '$product', nRating: { $sum: 1 }, avgRating: { $avg: '$rating' } } }
  ]);
  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratings: Math.round(stats[0].avgRating * 10) / 10,
      numOfReviews: stats[0].nRating
    });
  } else {
    await Product.findByIdAndUpdate(productId, { ratings: 0, numOfReviews: 0 });
  }
};

reviewSchema.post('save', function() {
  this.constructor.calcAverageRatings(this.product);
});

reviewSchema.post('remove', function() {
  this.constructor.calcAverageRatings(this.product);
});

module.exports = mongoose.model('Review', reviewSchema);
