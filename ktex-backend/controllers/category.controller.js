const Category = require('../models/Category.model');
const Product  = require('../models/Product.model');

exports.getCategories = async (req, res) => {
  try {
    const filter = {};
    if (req.query.pageType) {
      filter.pageTypes = req.query.pageType;
    }
    const categories = await Category.find(filter).sort({ order: 1, name: 1 });
    res.status(200).json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ success: true, message: 'Created', data: category });
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ success: false, message: 'Name already exists' });
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!category) return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, message: 'Updated', data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSubCategoryAnalytics = async (req, res) => {
  try {
    const { pageType, subCategory } = req.query;
    const filter = { isActive: true };
    if (pageType)    filter.pageType = pageType;
    if (subCategory) filter.subCategory = subCategory;

    const [products, stats] = await Promise.all([
      Product.find(filter).select('name images sku price discountPrice stock pageType subCategory isActive createdAt').sort({ createdAt: -1 }),
      Product.aggregate([
        { $match: filter },
        { $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          totalStock: { $sum: '$stock' },
          lowStock: { $sum: { $cond: [{ $lte: ['$stock', 5] }, 1, 0] } },
          outOfStock: { $sum: { $cond: [{ $lte: ['$stock', 0] }, 1, 0] } }
        }}
      ])
    ]);

    const analytics = stats[0] || { totalProducts: 0, minPrice: 0, maxPrice: 0, totalStock: 0, lowStock: 0, outOfStock: 0 };

    res.status(200).json({ success: true, count: products.length, analytics, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.seedDefaultCategories = async (req, res) => {
  try {
    const existing = await Category.countDocuments();
    if (existing > 0) {
      return res.status(200).json({ success: true, message: 'Already seeded', count: existing });
    }
    const defaults = [
      { name: 'Polo', image: '', pageTypes: ['Men', 'Women', 'Kids'], order: 1 },
      { name: 'T-Shirts', image: '', pageTypes: ['Men', 'Women', 'Kids'], order: 2 },
      { name: 'Round Neck', image: '', pageTypes: ['Men', 'Women', 'Kids'], order: 3 },
      { name: 'Hoodies', image: '', pageTypes: ['Men', 'Women', 'Kids'], order: 4 },
      { name: 'Dresses', image: '', pageTypes: ['Women', 'Kids'], order: 5 },
      { name: 'Tops', image: '', pageTypes: ['Women', 'Kids'], order: 6 },
      { name: 'Abaya', image: '', pageTypes: ['Women'], order: 7 },
      { name: 'Co-Ord Sets', image: '', pageTypes: ['Women'], order: 8 },
      { name: 'Jackets', image: '', pageTypes: ['Men', 'Women'], order: 9 },
      { name: 'Bottoms', image: '', pageTypes: ['Men', 'Women', 'Kids'], order: 10 }
    ];
    await Category.insertMany(defaults);
    const created = await Category.find();
    res.status(201).json({ success: true, message: 'Seeded', count: created.length, data: created });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
