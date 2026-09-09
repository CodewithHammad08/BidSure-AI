import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async () => {
  const connUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/Bid-Sure-AI';
  try {
    const conn = await mongoose.connect(connUri);
    console.log(`[MongoDB Connected]: ${conn.connection.host} / Database: ${conn.connection.name}`);
  } catch (error) {
    console.warn(`[MongoDB Error]: Could not connect to MongoDB Atlas at ${connUri}`, error.message);
  }
};
