import { PrismaClient } from '@prisma/client';
import { env } from './env';

declare global {
  var prismaSingleton: PrismaClient | undefined;
}

export const prisma =
  globalThis.prismaSingleton ||
  new PrismaClient({
    log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (env.NODE_ENV !== 'production') {
  globalThis.prismaSingleton = prisma;
}

export const connectDatabase = async () => {
  try {
    await prisma.$connect();
    console.log('✅ PostgreSQL Database connected successfully via Prisma.');
  } catch (error) {
    console.error('❌ Failed to connect to PostgreSQL Database:', error);
  }
};
