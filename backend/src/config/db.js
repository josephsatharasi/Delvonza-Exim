const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI is required in .env');
  }
  await mongoose.connect(uri);
  // eslint-disable-next-line no-console
  console.log('MongoDB connected');
};

module.exports = connectDB;
