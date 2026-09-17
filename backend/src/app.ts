import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import { prisma } from './config/database';
import authRoutes from './routes/auth.routes';
import resumeRoutes from './routes/resume.routes';
import mentorRoutes from './routes/mentor.routes';
import codingRoutes from './routes/coding.routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();

// Security Headers
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: [env.CLIENT_URL, 'http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Body Parsing & Cookie Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Quick database ping
    await prisma.$queryRaw`SELECT 1`;
    return res.status(200).json({
      status: 'ok',
      service: 'Nexora Backend Express API',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return res.status(200).json({
      status: 'ok',
      service: 'Nexora Backend Express API',
      database: 'disconnected',
      timestamp: new Date().toISOString(),
    });
  }
});

// Mount API routes (Both /api/... and /api/v1/... for flexible frontend calls)
app.use('/api/auth', authRoutes);
app.use('/api/v1/auth', authRoutes);

app.use('/api/resumes', resumeRoutes);
app.use('/api/v1/resumes', resumeRoutes);

app.use('/api/mentor', mentorRoutes);
app.use('/api/v1/mentor', mentorRoutes);

app.use('/api/coding', codingRoutes);
app.use('/api/v1/coding', codingRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
