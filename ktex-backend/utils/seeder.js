require('dotenv').config();
const mongoose = require('mongoose');
const User     = require('../models/User.model');
const Product  = require('../models/Product.model');
const Order    = require('../models/Order.model');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ktex_db';

const users = [
  { name: 'Admin K-TEX', email: 'admin@ktex.com', password: 'admin1234', role: 'admin', phone: '+923001234567' },
  { name: 'Ayesha Khan',  email: 'ayesha@test.com', password: 'test1234',  role: 'user',  phone: '+923009876543' },
  { name: 'Ali Hassan',   email: 'ali@test.com',    password: 'test1234',  role: 'user',  phone: '+923331234567' }
];

const products = [
  {
    name: 'Autumn Noir Sherwani', category: 'Men', subCategory: 'Formal',
    description: 'Exquisite black sherwani with gold embroidery. Perfect for weddings and formal events.',
    price: 45000, discountPrice: 38000, fabric: 'Raw Silk',
    images: [{ url: 'https://via.placeholder.com/500x600?text=Autumn+Noir+Sherwani' }],
    sizes: [{ size: 'M', stock: 5 }, { size: 'L', stock: 3 }, { size: 'XL', stock: 2 }],
    colors: [{ name: 'Black', hexCode: '#000000' }, { name: 'Navy', hexCode: '#003153' }],
    tags: ['sherwani', 'wedding', 'formal', 'men'], isFeatured: true, isNewArrival: false
  },
  {
    name: 'Golden Hour Lehenga', category: 'Bridal', subCategory: 'Traditional',
    description: 'Stunning gold lehenga with intricate zari work. The ultimate bridal ensemble.',
    price: 120000, discountPrice: 0, fabric: 'Pure Katan Silk',
    images: [{ url: 'https://via.placeholder.com/500x600?text=Golden+Hour+Lehenga' }],
    sizes: [{ size: 'S', stock: 2 }, { size: 'M', stock: 3 }, { size: 'Custom', stock: 10 }],
    colors: [{ name: 'Gold', hexCode: '#FFD700' }, { name: 'Ivory', hexCode: '#FFFFF0' }],
    tags: ['lehenga', 'bridal', 'wedding', 'women'], isFeatured: true, isNewArrival: true
  },
  {
    name: 'Ivory Dreams Kurta Set', category: 'Women', subCategory: 'Casual',
    description: 'Elegant ivory kurta set with delicate embroidery. Perfect for festive occasions.',
    price: 12000, discountPrice: 9500, fabric: 'Lawn',
    images: [{ url: 'https://via.placeholder.com/500x600?text=Ivory+Dreams' }],
    sizes: [{ size: 'XS', stock: 8 }, { size: 'S', stock: 12 }, { size: 'M', stock: 10 }, { size: 'L', stock: 6 }],
    colors: [{ name: 'Ivory', hexCode: '#FFFFF0' }, { name: 'Cream', hexCode: '#FFFDD0' }],
    tags: ['kurta', 'casual', 'women', 'lawn'], isFeatured: false, isNewArrival: true
  },
  {
    name: 'Royal Navy Suit', category: 'Men', subCategory: 'Formal',
    description: 'Premium 3-piece navy suit crafted for the modern Pakistani gentleman.',
    price: 28000, discountPrice: 0, fabric: 'Wool Blend',
    images: [{ url: 'https://via.placeholder.com/500x600?text=Royal+Navy+Suit' }],
    sizes: [{ size: 'M', stock: 4 }, { size: 'L', stock: 6 }, { size: 'XL', stock: 3 }, { size: 'XXL', stock: 2 }],
    colors: [{ name: 'Navy', hexCode: '#003153' }, { name: 'Charcoal', hexCode: '#36454F' }],
    tags: ['suit', 'formal', 'men', 'office'], isFeatured: true, isNewArrival: false
  },
  {
    name: 'Mini Princess Frock', category: 'Kids', subCategory: 'Traditional',
    description: 'Adorable princess frock with lace detailing for little fashionistas.',
    price: 3500, discountPrice: 2800, fabric: 'Net + Satin',
    images: [{ url: 'https://via.placeholder.com/500x600?text=Princess+Frock' }],
    sizes: [{ size: 'XS', stock: 15 }, { size: 'S', stock: 10 }],
    colors: [{ name: 'Pink', hexCode: '#FFB6C1' }, { name: 'Lilac', hexCode: '#C8A2C8' }],
    tags: ['kids', 'frock', 'girls', 'party'], isFeatured: false, isNewArrival: true
  },
  {
    name: 'Crimson Bridal Gharara', category: 'Bridal', subCategory: 'Traditional',
    description: 'Majestic crimson gharara with heavy embellishment. A timeless bridal classic.',
    price: 85000, discountPrice: 75000, fabric: 'Velvet + Tissue',
    images: [{ url: 'https://via.placeholder.com/500x600?text=Crimson+Gharara' }],
    sizes: [{ size: 'S', stock: 3 }, { size: 'M', stock: 4 }, { size: 'Custom', stock: 10 }],
    colors: [{ name: 'Crimson', hexCode: '#DC143C' }, { name: 'Maroon', hexCode: '#800000' }],
    tags: ['gharara', 'bridal', 'wedding', 'women'], isFeatured: true, isNewArrival: false
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([User.deleteMany(), Product.deleteMany(), Order.deleteMany()]);
    console.log('🗑️  Cleared existing data');

    // Create users
    const createdUsers = await User.create(users);
    const adminUser = createdUsers.find(u => u.role === 'admin');
    console.log(`👤 Created ${createdUsers.length} users`);
    console.log(`   Admin: admin@ktex.com / admin1234`);
    console.log(`   User:  ayesha@test.com / test1234`);

    // Create products
    const productsWithCreator = products.map(p => ({ ...p, createdBy: adminUser._id }));
    const createdProducts = await Product.create(productsWithCreator);
    console.log(`👗 Created ${createdProducts.length} products`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('🚀 Run: npm run dev  to start the server');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDB();
