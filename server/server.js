import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';

import { connectDB } from './config/db.js';
import { autoSeedIfEmpty } from './config/bootstrap.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { globalErrorHandler } from './middleware/errorHandler.js';
import routes from './routes/index.js';

const app = express();
app.set('trust proxy', 1);

// Security & Optimization Middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// Resilient CORS configuration
const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.CLIENT_URL?.replace(/\/+$/, ''),
  'https://noor-tattoo-studio.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000'
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const cleanOrigin = origin.replace(/\/+$/, '');
      const isAllowed = allowedOrigins.some(o => o.replace(/\/+$/, '') === cleanOrigin);
      if (isAllowed || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true
  })
);

app.use(compression());
app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());
app.use(mongoSanitize());

// Rate Limiting on API
app.use('/api', apiLimiter);

// Static uploads serving (local development storage)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Main API Routes
app.use('/api', routes);

// 404 Handler for undefined API routes
app.use('/api', (req, res) => res.status(404).json({ message: 'Not found' }));

// Global Error Handler
app.use(globalErrorHandler);

// Validate essential environment variables
if (!process.env.JWT_SECRET || !process.env.MONGODB_URI) {
  console.error('Missing essential environment variables: Set JWT_SECRET and MONGODB_URI in server/.env');
  process.exit(1);
}

// Connect to Database, auto-seed defaults if brand new, and start listening
await connectDB();
await autoSeedIfEmpty();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API server running on port ${PORT}`));

export default app;
