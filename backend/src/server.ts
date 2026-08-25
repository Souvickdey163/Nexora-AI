import app from './app';
import { env } from './config/env';
import { connectDatabase, prisma } from './config/database';
import { logger } from './utils/logger';

const startServer = async () => {
  try {
    await connectDatabase();

    const server = app.listen(env.PORT, () => {
      logger.info(`🚀 Nexora Backend API running on http://localhost:${env.PORT}`);
      logger.info(`👉 Health Check: http://localhost:${env.PORT}/health`);
      logger.info(`👉 Auth API: http://localhost:${env.PORT}/api/auth`);
    });

    const gracefulShutdown = async () => {
      logger.info('Shutting down server gracefully...');
      server.close(async () => {
        await prisma.$disconnect();
        logger.info('Database connection closed. Exiting process.');
        process.exit(0);
      });
    };

    process.on('SIGINT', gracefulShutdown);
    process.on('SIGTERM', gracefulShutdown);
  } catch (error: any) {
    logger.error(`Failed to start server: ${error.message || error}`);
    process.exit(1);
  }
};

startServer();
