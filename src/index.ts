import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { prisma } from './config/database';
import userRoutes from './routes/userRoutes';
import feedbackRoutes from './routes/feedbackRoutes';
import infographicRoutes from './routes/infographicRoutes';
import bbwsRoutes from './routes/bbwsRoutes';
import activityLogRoutes from './routes/activityLogRoutes';
import reportRoutes from './routes/reportRoutes';
import regionUpdateRoutes from './routes/regionUpdateRoutes';
import bmkgRoutes from './routes/bmkgRoutes';
import bpbdRoutes from './routes/bpbdRoutes';
import { errorHandler } from './middlewares/errorHandler';
import { startBbwsSyncJob } from './jobs/bbwsSyncJob';

const app = express();
const PORT = process.env.PORT || 3000;

// Parse CORS_ORIGIN dari .env biar bisa baca banyak URL yang dipisah koma
const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(url => url.trim())
  : '*';

// Security Middleware 
app.use(helmet({
  crossOriginResourcePolicy: false, // <-- THIS IS THE MAGIC FIX
}));
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://w2cmkvbv-3000.asse.devtunnels.ms'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '10kb' }));

// Routes
app.use('/api', userRoutes);
app.use('/api', infographicRoutes);
app.use('/api', bbwsRoutes);
app.use('/api', bmkgRoutes);
app.use('/api', bpbdRoutes);
app.use('/api', feedbackRoutes);
app.use('/api', activityLogRoutes);
app.use('/api', reportRoutes);
app.use('/api', regionUpdateRoutes);

// Health check
app.get('/api/health', async (req, res) => {
  try {
    // Optional: Check DB connectivity during health check
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'error', database: 'disconnected' });
  }
});

// Global error handler (must be after all routes)
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

const bbwsJob = startBbwsSyncJob();

// Handle Graceful Shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(async () => {
    bbwsJob.stop();
    await prisma.$disconnect();
    console.log('HTTP server and Prisma connection closed');
  });
});
