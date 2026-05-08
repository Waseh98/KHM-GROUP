const Review  = require('../models/Review.model');
const Order   = require('../models/Order.model');
const Product = require('../models/Product.model');

// @POST /api/reviews/:productId
exports.createReview = async (req, res) => {
  try {
    const { rating, title, comment } = req.body;
    const productId = req.params.productId;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    // Check if user already reviewed
    const existing = await Review.findOne({ user: req.user._id, product: productId });
    if (existing) return res.status(400).json({ success: false, message: 'You already reviewed this product' });

    // Check verified purchase
    const hasPurchased = await Order.findOne({
      user: req.user._id,
      'orderItems.product': productId,
      orderStatus: 'delivered'
    });

    const review = await Review.create({
      user: req.user._id,
      product: productId,
      rating,
      title,
      comment,
      isVerifiedPurchase: !!hasPurchased
    });

    await review.populate('user', 'name avatar');
    res.status(201).json({ success: true, message: 'Review submitted!', data: review });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'You already reviewed this product' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/reviews/:productId
exports.getProductReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'newest' } = req.query;
    const sortOptions = { newest: { createdAt: -1 }, helpful: { helpful: -1 }, rating: { rating: -1 } };
    const skip = (Number(page) - 1) * Number(limit);

    const reviews = await Review.find({ product: req.params.productId, isApproved: true })
      .populate('user', 'name avatar')
      .sort(sortOptions[sort] || sortOptions.newest)
      .skip(skip).limit(Number(limit));

    const total = await Review.countDocuments({ product: req.params.productId, isApproved: true });

    // Rating breakdown
    const breakdown = await Review.aggregate([
      { $match: { product: require('mongoose').Types.ObjectId.createFromHexString(req.params.productId), isApproved: true } },
      { $group: { _id: '$rating', count: { $sum: 1 } } },
      { $sort: { _id: -1 } }
    ]);

    res.status(200).json({ success: true, count: reviews.length, total, data: reviews, breakdown });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @PUT /api/reviews/:id
exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    const { rating, title, comment } = req.body;
    review.rating  = rating  || review.rating;
    review.title   = title   || review.title;
    review.comment = comment || review.comment;
    await review.save();
    res.status(200).json({ success: true, message: 'Review updated', data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @DELETE /api/reviews/:id
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await review.deleteOne();
    await Review.calcAverageRatings(review.product);
    res.status(200).json({ success: true, message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @PUT /api/reviews/:id/helpful
exports.markHelpful = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    const index = review.helpful.indexOf(req.user._id);
    if (index === -1) review.helpful.push(req.user._id);
    else review.helpful.splice(index, 1);
    await review.save();
    res.status(200).json({ success: true, helpfulCount: review.helpful.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
