// IMPORTANT: dotenv MUST be loaded before any other module that reads process.env
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';

// Load routes (after dotenv so services can read API keys)
import candidateRoutes from './routes/candidateRoutes';
import jobRoutes from './routes/jobRoutes';
import rankingRoutes from './routes/rankingRoutes';
import aiRoutes from './routes/aiRoutes';

// Initialize DB
import { initDb } from './database/db';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/candidates', candidateRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/rankings', rankingRoutes);
app.use('/api/ai', aiRoutes);

// Base route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, async () => {
  try {
    await initDb();
    console.log(`Database initialized.`);
  } catch (err) {
    console.error('Failed to initialize database:', err);
  }
  console.log(`Server is running on port ${PORT}`);
});
