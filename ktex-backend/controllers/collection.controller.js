const Collection = require('../models/Collection.model');
const Product = require('../models/Product.model');

exports.getCollections = async (req, res) => {
  try {
    const collections = await Collection.find({ isActive: true })
      .populate('categories', 'name slug image')
      .sort({ order: 1, name: 1 });
    res.status(200).json({ success: true, count: collections.length, data: collections });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCollection = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id)
      .populate('categories', 'name slug image');
    if (!collection) return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, data: collection });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCollectionBySlug = async (req, res) => {
  try {
    const collection = await Collection.findOne({ slug: req.params.slug, isActive: true })
      .populate('categories', 'name slug image');
    if (!collection) return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, data: collection });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCollectionProducts = async (req, res) => {
  try {
    const collection = await Collection.findOne({ slug: req.params.slug, isActive: true });
    if (!collection) return res.status(404).json({ success: false, message: 'Not found' });

    const catIds = collection.categories || [];
    const filter = { isActive: true };
    if (catIds.length > 0) {
      filter.subCategory = { $in: catIds };
    }

    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createCollection = async (req, res) => {
  try {
    const collection = await Collection.create(req.body);
    res.status(201).json({ success: true, message: 'Created', data: collection });
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ success: false, message: 'Name already exists' });
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateCollection = async (req, res) => {
  try {
    const collection = await Collection.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!collection) return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, message: 'Updated', data: collection });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteCollection = async (req, res) => {
  try {
    const collection = await Collection.findByIdAndDelete(req.params.id);
    if (!collection) return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
