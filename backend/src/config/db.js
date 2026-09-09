import mongoose from 'mongoose';

export const connectDB = async () => {
  const connUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bidsure_ai';
  try {
    const conn = await mongoose.connect(connUri);
    console.log(`[MongoDB Connected]: ${conn.connection.host} / ${conn.connection.name}`);
  } catch (error) {
    console.warn(`[MongoDB Notice]: Could not connect to MongoDB at ${connUri}. Running with fallback in-memory cache.`);
  }
};
