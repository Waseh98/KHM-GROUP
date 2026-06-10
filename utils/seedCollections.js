require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Category = require('../models/Category.model');
const Collection = require('../models/Collection.model');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ktex_db';

const categoryData = [
  { name: 'Polo Shirts', pageTypes: ['Men', 'Women', 'Kids'], order: 1 },
  { name: 'T-Shirts', pageTypes: ['Men', 'Women', 'Kids'], order: 2 },
  { name: 'Round Neck', pageTypes: ['Men', 'Women', 'Kids'], order: 3 },
  { name: 'Hoodies', pageTypes: ['Men', 'Women', 'Kids'], order: 4 },
  { name: 'Dresses', pageTypes: ['Women', 'Kids'], order: 5 },
  { name: 'Tops', pageTypes: ['Women', 'Kids'], order: 6 },
  { name: 'Abaya', pageTypes: ['Women'], order: 7 },
  { name: 'Co-Ord Sets', pageTypes: ['Women'], order: 8 },
  { name: 'Jackets', pageTypes: ['Men', 'Women'], order: 9 },
  { name: 'Bottoms', pageTypes: ['Men', 'Women', 'Kids'], order: 10 }
];

const collectionsToSeed = [
  {
    name: "Men's Collection",
    description: "Premium polo shirts and t-shirts for the modern gentleman",
    image: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&q=80",
    categoryNames: ['Polo Shirts', 'T-Shirts', 'Round Neck', 'Jackets', 'Bottoms'],
    order: 1
  },
  {
    name: "Women's Collection",
    description: "Elegant and comfortable apparel for every occasion",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&q=80",
    categoryNames: ['Polo Shirts', 'T-Shirts', 'Dresses', 'Tops', 'Abaya', 'Co-Ord Sets', 'Jackets', 'Bottoms'],
    order: 2
  },
  {
    name: "Summer Collection",
    description: "Light & breathable comfort for the warm months ahead",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80",
    categoryNames: ['Polo Shirts', 'T-Shirts', 'Tops', 'Bottoms'],
    order: 3
  },
  {
    name: "Winter Edition",
    description: "Stay warm in style with premium wools, hoodies, and jackets",
    image: "https://images.unsplash.com/photo-1544923246-77307dd654cb?w=800&q=80",
    categoryNames: ['Hoodies', 'Jackets', 'Bottoms'],
    order: 4
  },
  {
    name: "Sale Collection",
    description: "Up to 50% off on selected items — grab them before they're gone",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80",
    categoryNames: ['Polo Shirts', 'T-Shirts', 'Bottoms'],
    order: 5
  }
];

async function seed() {
  console.log('🔄 Connecting to MongoDB...');
  await mongoose.connect(MONGO_URI);
  console.log('✅ MongoDB connected');

  // 1. Seed Categories
  console.log('🌱 Seeding Categories...');
  const categoryMap = {};
  
  for (const cat of categoryData) {
    const slug = cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    
    // Find if category already exists by name OR by slug
    let existing = await Category.findOne({
      $or: [
        { name: cat.name },
        { slug: slug }
      ]
    });
    
    if (!existing) {
      existing = await Category.create(cat);
      console.log(`➕ Created Category: ${existing.name}`);
    } else {
      console.log(`✔ Category already exists: ${existing.name} (ID: ${existing._id})`);
    }
    categoryMap[cat.name] = existing._id;
  }

  // Fetch all categories currently in DB just in case some other names exist in DB (e.g. from prior runs)
  const allCategories = await Category.find();
  allCategories.forEach(cat => {
    // Map case-insensitive names and slugs
    categoryMap[cat.name] = cat._id;
    categoryMap[cat.name.toLowerCase()] = cat._id;
    categoryMap[cat.slug] = cat._id;
  });

  // 2. Seed Collections
  console.log('🌱 Seeding Collections...');
  for (const col of collectionsToSeed) {
    // Look up category IDs from map
    const categoryIds = col.categoryNames.map(name => {
      // try exact name, lowercase name, or slug
      return categoryMap[name] || categoryMap[name.toLowerCase()] || categoryMap[name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')];
    }).filter(Boolean);

    const colData = {
      name: col.name,
      description: col.description,
      image: col.image,
      order: col.order,
      categories: categoryIds,
      isActive: true
    };

    let existingCol = await Collection.findOne({ name: col.name });
    if (!existingCol) {
      existingCol = await Collection.create(colData);
      console.log(`➕ Created Collection: ${existingCol.name} with ${categoryIds.length} categories`);
    } else {
      existingCol.description = colData.description;
      existingCol.image = colData.image;
      existingCol.order = colData.order;
      existingCol.categories = colData.categories;
      await existingCol.save();
      console.log(`✔ Updated Collection: ${existingCol.name} with ${categoryIds.length} categories`);
    }
  }

  console.log('🎉 Seeding successfully completed!');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
