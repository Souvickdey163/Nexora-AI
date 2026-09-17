"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationSchema = exports.analyzeResumeSchema = exports.createResumeSchema = void 0;
const zod_1 = require("zod");
exports.createResumeSchema = zod_1.z.object({
    title: zod_1.z.string().max(100, 'Resume title cannot exceed 100 characters').optional().default('My Resume'),
});
exports.analyzeResumeSchema = zod_1.z.object({
    targetRole: zod_1.z.string().max(100, 'Target role cannot exceed 100 characters').optional(),
    targetCompany: zod_1.z.string().max(100, 'Target company cannot exceed 100 characters').optional(),
    jobDescription: zod_1.z.string().max(10000, 'Job description cannot exceed 10,000 characters').optional(),
});
exports.paginationSchema = zod_1.z.object({
    page: zod_1.z.string().transform((val) => Math.max(1, parseInt(val, 10) || 1)).optional().default('1'),
    limit: zod_1.z.string().transform((val) => Math.min(50, Math.max(1, parseInt(val, 10) || 10))).optional().default('10'),
});
