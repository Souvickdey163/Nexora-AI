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
import interviewRoutes from './routes/interview.routes';
import githubRoutes from './routes/github.routes';
import creditRoutes from './routes/credit.routes';
import paymentRoutes from './routes/payment.routes';
import profileRoutes from './routes/profile.routes';
import roadmapRoutes from './routes/roadmap.routes';
import assessmentRoutes from './routes/assessment.routes';
import analyticsRoutes from './routes/analytics.routes';
import placementRoutes from './routes/placement.routes';
import learningRoutes from './routes/learning.routes';
import dashboardRoutes from './routes/dashboard.routes';
import notificationRoutes from './routes/notification.routes';
import activityRoutes from './routes/activity.routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();

// Security Headers
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

// CORS configuration
app.use(
  cors({
    origin: [env.CLIENT_URL, 'http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'x-razorpay-signature'],
  })
);

// Body Parsing & Cookie Parsing with rawBody preservation for webhooks
app.use(
  express.json({
    limit: '10mb',
    verify: (req, res, buf) => {
      (req as any).rawBody = buf;
    },
  })
);
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

app.use('/api/interviews', interviewRoutes);
app.use('/api/v1/interviews', interviewRoutes);

app.use('/api/github', githubRoutes);
app.use('/api/v1/github', githubRoutes);

app.use('/api/credits', creditRoutes);
app.use('/api/v1/credits', creditRoutes);

app.use('/api/payments', paymentRoutes);
app.use('/api/v1/payments', paymentRoutes);

app.use('/api/profile', profileRoutes);
app.use('/api/v1/profile', profileRoutes);

app.use('/api/roadmap', roadmapRoutes);
app.use('/api/v1/roadmap', roadmapRoutes);

app.use('/api/assessment', assessmentRoutes);
app.use('/api/v1/assessment', assessmentRoutes);

app.use('/api/analytics', analyticsRoutes);
app.use('/api/v1/analytics', analyticsRoutes);

app.use('/api/placement', placementRoutes);
app.use('/api/v1/placement', placementRoutes);

app.use('/api/learning', learningRoutes);
app.use('/api/v1/learning', learningRoutes);

app.use('/api/dashboard', dashboardRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);

app.use('/api/notifications', notificationRoutes);
app.use('/api/v1/notifications', notificationRoutes);

app.use('/api/activities', activityRoutes);
app.use('/api/v1/activities', activityRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;

