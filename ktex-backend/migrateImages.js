require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const Product = require('./models/Product.model');
const { processImageArray } = require('./utils/imageUploader');

async function migrate() {
  try {
    console.log('Connecting to DB...', process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log('DB Connected.');

    const products = await Product.find({});
    console.log(`Found ${products.length} products to check.`);

    let updatedCount = 0;

    for (let product of products) {
      let needsUpdate = false;
      
      // Check if any image is base64
      if (product.images && product.images.length > 0) {
        for (let img of product.images) {
          if (img.url && img.url.startsWith('data:image/')) {
            needsUpdate = true;
            break;
          }
        }
      }

      if (needsUpdate) {
        console.log(`Migrating images for product: ${product.name}`);
        // Process images
        const newImages = processImageArray(product.images);
        product.images = newImages;
        await product.save();
        updatedCount++;
      }
    }

    console.log(`Migration completed. Updated ${updatedCount} products.`);
    process.exit(0);
  } catch (err) {
    console.error('Migration error:', err);
    process.exit(1);
  }
}

migrate();
