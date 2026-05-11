require('dotenv').config();
const mongoose = require('mongoose');

console.log('Testing MongoDB connection...');
console.log('URI:', process.env.MONGO_URI.replace(/:[^:@]+@/, ':****@'));

mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 })
  .then(() => {
    console.log('✅ SUCCESS! MongoDB Connected!');
    return mongoose.connection.db.listCollections().toArray();
  })
  .then(collections => {
    console.log('Collections:', collections.map(c => c.name).join(', '));
    process.exit(0);
  })
  .catch(err => {
    console.log('❌ FAILED:', err.message);
    process.exit(1);
  });
