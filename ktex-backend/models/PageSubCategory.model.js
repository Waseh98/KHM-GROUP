const mongoose = require('mongoose');

const pageSubCategorySchema = new mongoose.Schema({
  pageType: {
    type: String,
    required: [true, 'Page type is required'],
    enum: ['Sale', 'Men', 'Women', 'NewArrivals', 'Kids'],
    index: true
  },
  name: {
    type: String,
    required: [true, 'Sub-category name is required'],
    trim: true
  },
  slug: { type: String, lowercase: true, trim: true },
  image: { type: String, default: '' },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

pageSubCategorySchema.pre('save', function (next) {
  if (!this.slug || this.isModified('name')) {
    this.slug = String(this.name || '')
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

pageSubCategorySchema.index({ pageType: 1, slug: 1 }, { unique: true });

module.exports = mongoose.model('PageSubCategory', pageSubCategorySchema);
