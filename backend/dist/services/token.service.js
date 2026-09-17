"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const database_1 = require("../config/database");
const env_1 = require("../config/env");
class TokenService {
    generateAccessToken(payload) {
        return jsonwebtoken_1.default.sign({ ...payload, jti: crypto_1.default.randomUUID() }, env_1.env.JWT_SECRET, { expiresIn: env_1.env.JWT_EXPIRES_IN });
    }
    generateRefreshToken() {
        return crypto_1.default.randomBytes(40).toString('hex');
    }
    verifyAccessToken(token) {
        return jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
    }
    async createSession(userId, accessToken, userAgent, ipAddress) {
        const refreshToken = this.generateRefreshToken();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);
        await database_1.prisma.session.create({
            data: {
                userId,
                token: accessToken,
                refreshToken,
                userAgent,
                ipAddress,
                expiresAt,
            },
        });
        return {
            accessToken,
            refreshToken,
            expiresIn: env_1.env.JWT_EXPIRES_IN,
        };
    }
    async refreshSession(refreshToken, userAgent, ipAddress) {
        const existingSession = await database_1.prisma.session.findUnique({
            where: { refreshToken },
            include: { user: true },
        });
        if (!existingSession || existingSession.isRevoked || existingSession.expiresAt < new Date()) {
            throw new Error('Invalid or expired refresh token');
        }
        await database_1.prisma.session.update({
            where: { id: existingSession.id },
            data: { isRevoked: true },
        });
        const newAccessToken = this.generateAccessToken({
            userId: existingSession.user.id,
            email: existingSession.user.email,
            status: existingSession.user.status,
        });
        return this.createSession(existingSession.user.id, newAccessToken, userAgent, ipAddress);
    }
    async revokeSession(accessToken) {
        await database_1.prisma.session.updateMany({
            where: { token: accessToken },
            data: { isRevoked: true },
        });
    }
}
exports.tokenService = new TokenService();
