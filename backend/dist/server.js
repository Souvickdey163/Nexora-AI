"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const database_1 = require("./config/database");
const logger_1 = require("./utils/logger");
const startServer = async () => {
    try {
        await (0, database_1.connectDatabase)();
        const server = app_1.default.listen(env_1.env.PORT, () => {
            logger_1.logger.info(`🚀 Nexora Backend API running on http://localhost:${env_1.env.PORT}`);
            logger_1.logger.info(`👉 Health Check: http://localhost:${env_1.env.PORT}/health`);
            logger_1.logger.info(`👉 Auth API: http://localhost:${env_1.env.PORT}/api/auth`);
        });
        const gracefulShutdown = async () => {
            logger_1.logger.info('Shutting down server gracefully...');
            server.close(async () => {
                await database_1.prisma.$disconnect();
                logger_1.logger.info('Database connection closed. Exiting process.');
                process.exit(0);
            });
        };
        process.on('SIGINT', gracefulShutdown);
        process.on('SIGTERM', gracefulShutdown);
    }
    catch (error) {
        logger_1.logger.error(`Failed to start server: ${error.message || error}`);
        process.exit(1);
    }
};
startServer();
