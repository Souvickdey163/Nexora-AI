"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = exports.prisma = void 0;
const client_1 = require("@prisma/client");
const env_1 = require("./env");
exports.prisma = globalThis.prismaSingleton ||
    new client_1.PrismaClient({
        log: env_1.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
if (env_1.env.NODE_ENV !== 'production') {
    globalThis.prismaSingleton = exports.prisma;
}
const connectDatabase = async () => {
    try {
        await exports.prisma.$connect();
        console.log('✅ PostgreSQL Database connected successfully via Prisma.');
    }
    catch (error) {
        console.error('❌ Failed to connect to PostgreSQL Database:', error);
    }
};
exports.connectDatabase = connectDatabase;
