const PageSubCategory = require('../models/PageSubCategory.model');

exports.getPageSubCategories = async (req, res) => {
  try {
    const filter = { isActive: true };
    if (req.query.pageType) filter.pageType = req.query.pageType;
    const items = await PageSubCategory.find(filter).sort({ order: 1, name: 1 });
    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPageSubCategory = async (req, res) => {
  try {
    const item = await PageSubCategory.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createPageSubCategory = async (req, res) => {
  try {
    const item = await PageSubCategory.create(req.body);
    res.status(201).json({ success: true, message: 'Created', data: item });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'A sub-category with this name already exists on this page' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updatePageSubCategory = async (req, res) => {
  try {
    const item = await PageSubCategory.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, message: 'Updated', data: item });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'A sub-category with this name already exists on this page' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deletePageSubCategory = async (req, res) => {
  try {
    const item = await PageSubCategory.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
