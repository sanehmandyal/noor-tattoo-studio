import mongoose from 'mongoose';

// Setup connection lifecycle event handlers once
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB connection lost. Mongoose will attempt automatic reconnection.');
});

mongoose.connection.on('error', err => {
  console.error('⚠️  MongoDB connection error:', err.message);
});

mongoose.connection.on('reconnected', () => {
  console.log('✓  MongoDB reconnected successfully.');
});

export const connectDB = async (retryCount = 0) => {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) {
    console.error('MONGODB_URI is required in server/.env or environment variables');
    return null;
  }

  const dbName = process.env.DB_NAME || 'noor-tattoo-studio';

  try {
    const conn = await mongoose.connect(uri, {
      dbName,
      serverSelectionTimeoutMS: 15000,
      autoIndex: process.env.NODE_ENV !== 'production'
    });
    console.log(`✓ MongoDB Connected to cluster: ${conn.connection.host} [Database: ${conn.connection.name}]`);
    return conn;
  } catch (error) {
    console.error(`MongoDB connection attempt ${retryCount + 1} failed: ${error.message}`);
    if (retryCount < 5) {
      console.log(`Retrying MongoDB connection in 3 seconds...`);
      await new Promise(r => setTimeout(r, 3000));
      return connectDB(retryCount + 1);
    }
    // Schedule background retries instead of abandoning connection permanently
    setTimeout(() => {
      console.log('Attempting background MongoDB reconnection...');
      connectDB(0).catch(() => {});
    }, 15000);

    return null;
  }
};
