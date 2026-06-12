const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Collection name is required'],
    unique: true,
    trim: true
  },
  slug: { type: String, unique: true, lowercase: true },
  image: { type: String, default: '' },
  description: { type: String, default: '' },
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  pageType: {
    type: String,
    enum: ['', 'Sale', 'Men', 'Women', 'NewArrivals', 'Kids', 'Custom'],
    default: ''
  },
  customPath: { type: String, default: '' },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

collectionSchema.pre('save', function(next) {
  if (!this.slug || this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }
  next();
});

module.exports = mongoose.model('Collection', collectionSchema);
