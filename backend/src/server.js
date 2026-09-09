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

app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tenders', tenderRoutes);
app.use('/api/bidders', bidderRoutes);
app.use('/api/findings', findingRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/adapters', adapterRoutes);
app.use('/api/stats', statsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'BidSure-AI Express Backend (JavaScript)', timestamp: new Date().toISOString() });
});

connectDB().then(async () => {
  try {
    await seedDatabase();
  } catch (e) {
    console.log('[Notice]: Seed skipped or ran in-memory.');
  }

  const server = app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🛡️  BidSure-AI Express Server (JS) running on port ${PORT}`);
    console.log(`📡  API Root: http://localhost:${PORT}/api`);
    console.log(`====================================================`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`\n⚠️  [Port ${PORT} in use]: The BidSure-AI backend server is ALREADY running on port ${PORT}!`);
      console.log(`📡  Your API is active and ready at: http://localhost:${PORT}/api\n`);
      process.exit(0);
    } else {
      console.error('[Server Error]:', err);
    }
  });
});
