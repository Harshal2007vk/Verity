// IMPORTANT: dotenv MUST be loaded before any other module that reads process.env
import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
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
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
];
// Add production frontend URL from env var (set this to your Vercel URL)
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL.replace(/\/+$/, '')); // strip trailing slash
}
app.use(cors({
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (e.g. server-to-server, curl, mobile)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS: unexpected origin "${origin}" — allowing anyway`);
      callback(null, true); // Allow all for now but log unexpected origins
    }
  },
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/candidates', candidateRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/rankings', rankingRoutes);
app.use('/api/ai', aiRoutes);

// Base route
import { getSupabase } from './database/db';

app.get('/api/health', async (req: Request, res: Response) => {
  try {
    const s = getSupabase();
    await s.from('jobs').select('id', { count: 'exact', head: true });
    res.json({ 
      status: 'ok', 
      database: 'connected',
      cors_frontend_url: process.env.FRONTEND_URL || 'not-set',
      node_env: process.env.NODE_ENV || 'development'
    });
  } catch (err: any) {
    res.status(500).json({ 
      status: 'error', 
      database: 'disconnected', 
      details: err.message || String(err) 
    });
  }
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
