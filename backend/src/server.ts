import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { seedDatabase } from './seed/seed.js';

import authRoutes from './routes/authRoutes.js';
import tenderRoutes from './routes/tenderRoutes.js';
import bidderRoutes from './routes/bidderRoutes.js';
import findingRoutes from './routes/findingRoutes.js';
import auditRoutes from './routes/auditRoutes.js';
import adapterRoutes from './routes/adapterRoutes.js';
import statsRoutes from './routes/statsRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tenders', tenderRoutes);
app.use('/api/bidders', bidderRoutes);
app.use('/api/findings', findingRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/adapters', adapterRoutes);
app.use('/api/stats', statsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'BidSure-AI Express Backend', timestamp: new Date().toISOString() });
});

// Connect to MongoDB and seed database on initial launch if needed
connectDB().then(async () => {
  try {
    await seedDatabase();
  } catch (e) {
    console.log('[Notice]: Seed skipped or ran in-memory.');
  }

  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🛡️  BidSure-AI Express Server running on port ${PORT}`);
    console.log(`📡  API Root: http://localhost:${PORT}/api`);
    console.log(`====================================================`);
  });
});
