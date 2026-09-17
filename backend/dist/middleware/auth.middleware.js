"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const token_service_1 = require("../services/token.service");
const client_1 = require("@prisma/client");
const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            res.status(401).json({
                success: false,
                error: 'Access token is missing or malformed',
            });
            return;
        }
        const payload = token_service_1.tokenService.verifyAccessToken(token);
        if (payload.status === client_1.UserStatus.SUSPENDED || payload.status === client_1.UserStatus.DEACTIVATED) {
            res.status(403).json({
                success: false,
                error: 'Account access has been restricted',
            });
            return;
        }
        req.user = payload;
        req.accessToken = token;
        next();
    }
    catch (err) {
        res.status(401).json({
            success: false,
            error: 'Invalid or expired access token',
        });
    }
};
exports.authenticateToken = authenticateToken;
