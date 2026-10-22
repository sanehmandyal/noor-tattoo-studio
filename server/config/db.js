import mongoose from 'mongoose';

export const connectDB = async (retryCount = 0) => {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) {
    console.error('MONGODB_URI is required in server/.env or environment variables');
    return null;
  }
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      autoIndex: process.env.NODE_ENV !== 'production'
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB connection attempt ${retryCount + 1} failed: ${error.message}`);
    if (retryCount < 5) {
      console.log(`Retrying MongoDB connection in 3 seconds...`);
      await new Promise(r => setTimeout(r, 3000));
      return connectDB(retryCount + 1);
    }
    console.error('MongoDB max connection attempts reached. Server remains operational for diagnostics.');
    return null;
  }
};
