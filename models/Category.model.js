const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Subcategory name is required'],
    unique: true,
    trim: true
  },
  slug: { type: String, unique: true, lowercase: true },
  image: { type: String, default: '' },
  pageTypes: {
    type: [String],
    enum: ['Men', 'Women', 'Kids'],
    default: ['Men']
  },
  order: { type: Number, default: 0 }
}, { timestamps: true });

categorySchema.pre('save', function(next) {
  if (!this.slug || this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }
  next();
});

module.exports = mongoose.model('Category', categorySchema);
