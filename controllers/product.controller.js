const Product = require('../models/Product.model');
const { processImageArray, FOLDERS } = require('../utils/imageUploader');

exports.getAllProducts = async (req, res) => {
  try {
    const { pageType, category, mainCategory, subCategory, stockStatus, minPrice, maxPrice, search, sort, page = 1, limit = 12, featured, newArrival } = req.query;
    const query = { isActive: true };

    if (pageType) query.pageType = pageType;
    if (category) query.category = category;
    if (mainCategory) query.mainCategory = mainCategory;
    if (subCategory) query.subCategory = subCategory;
    if (featured) query.isFeatured = true;
    if (newArrival) query.isNewArrival = true;
    if (stockStatus === 'in_stock') query.stock = { $gt: 5 };
    if (stockStatus === 'low_stock') query.stock = { $gt: 0, $lte: 5 };
    if (stockStatus === 'out_of_stock') query.stock = { $lte: 0 };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const sortOptions = {
      'newest': { createdAt: -1 },
      'price-low': { price: 1 },
      'price-high': { price: -1 },
      'top-rated': { ratings: -1 },
      'popular': { numOfReviews: -1 }
    };
    const sortBy = sortOptions[sort] || { createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(query);
    const selectFields = 'name price discountPrice stock pageType mainCategory subCategory sku images productStatus isActive createdAt isFeatured isNewArrival ratings numOfReviews isFreeDelivery';

    const products = await Product.find(query)
      .sort(sortBy)
      .skip(skip)
      .limit(Number(limit))
      .select(selectFields);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      data: products
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate({
      path: 'reviews',
      populate: { path: 'user', select: 'name avatar' }
    });
    if (!product || !product.isActive) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

function formatProductError(error) {
  if (error.name === 'ValidationError') {
    return { status: 400, message: Object.values(error.errors).map((e) => e.message).join(', ') };
  }
  if (error.code === 11000) {
    return { status: 400, message: 'SKU already exists. Use a different SKU or leave it blank.' };
  }
  if (/image|too large/i.test(error.message || '')) {
    return { status: 400, message: error.message };
  }
  return { status: 500, message: error.message || 'Server error' };
}

exports.createProduct = async (req, res) => {
  try {
    req.body.createdBy = req.user._id;
    if (req.body.images?.length) {
      req.body.images = await processImageArray(req.body.images, FOLDERS.products);
    }
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, message: 'Product created successfully', data: product });
  } catch (error) {
    console.error('createProduct error:', error.message);
    const { status, message } = formatProductError(error);
    res.status(status).json({ success: false, message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    if (req.body.images?.length) {
      req.body.images = await processImageArray(req.body.images, FOLDERS.products);
    }
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true
    });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.status(200).json({ success: true, message: 'Product updated', data: product });
  } catch (error) {
    console.error('updateProduct error:', error.message);
    const { status, message } = formatProductError(error);
    res.status(status).json({ success: false, message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getFeaturedProducts = async (req, res) => {
  try {
    const selectFields = 'name price discountPrice stock pageType mainCategory subCategory sku images productStatus isActive createdAt isFeatured isNewArrival ratings numOfReviews isFreeDelivery';
    const products = await Product.find({ isFeatured: true, isActive: true })
      .select(selectFields)
      .limit(8);
    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};