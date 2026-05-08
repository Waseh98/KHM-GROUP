require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User.model');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ktex_db';
const email = (process.env.ADMIN_EMAIL || '').toLowerCase().trim();
const password = process.env.ADMIN_PASSWORD || '';
const name = process.env.ADMIN_NAME || 'KHM Admin';
const phone = process.env.ADMIN_PHONE || '+923001234567';

async function run() {
  if (!email || !password) {
    console.error('Missing ADMIN_EMAIL or ADMIN_PASSWORD in env.');
    process.exit(1);
  }

  await mongoose.connect(MONGO_URI);

  const existing = await User.findOne({ email }).select('+password');

  if (!existing) {
    await User.create({ name, email, password, role: 'admin', phone });
    console.log(`✅ Admin created: ${email}`);
  } else {
    existing.name = name;
    existing.role = 'admin';
    existing.phone = phone;
    existing.password = password; // re-hash via pre-save
    await existing.save();
    console.log(`✅ Admin updated: ${email}`);
  }

  process.exit(0);
}

run().catch((e) => {
  console.error('❌ Failed:', e.message);
  process.exit(1);
});

