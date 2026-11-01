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
  const localUri = process.env.MONGODB_LOCAL_URI?.trim() || 'mongodb://127.0.0.1:27017/noor-tattoo-studio';
  if (!uri && !localUri) {
    console.error('MONGODB_URI is required in server/.env or environment variables');
    return null;
  }

  const dbName = process.env.DB_NAME || 'noor-tattoo-studio';

  try {
    const conn = await mongoose.connect(uri, {
      dbName,
      serverSelectionTimeoutMS: 5000,
      autoIndex: process.env.NODE_ENV !== 'production'
    });
    console.log(`✓ MongoDB Connected to cluster: ${conn.connection.host} [Database: ${conn.connection.name}]`);
    return conn;
  } catch (error) {
    console.warn(`MongoDB primary cluster connection attempt failed: ${error.message}`);
    
    // In local development or if Atlas IP whitelist blocks connection, seamlessly fallback to running local MongoDB
    if (process.env.NODE_ENV !== 'production' || !process.env.RENDER) {
      try {
        console.log(`ℹ️ Checking local MongoDB fallback (${localUri})...`);
        const localConn = await mongoose.connect(localUri, {
          dbName,
          serverSelectionTimeoutMS: 3000,
          autoIndex: true
        });
        console.log(`✓ Successfully connected to local MongoDB fallback: ${localConn.connection.host} [Database: ${localConn.connection.name}]`);
        return localConn;
      } catch (localErr) {
        console.warn(`Local MongoDB fallback was not reachable: ${localErr.message}`);
      }
    }

    if (retryCount < 3) {
      console.log(`Retrying MongoDB connection in 3 seconds... (Attempt ${retryCount + 1}/3)`);
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
