"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePdfFile = void 0;
const env_1 = require("../config/env");
const validatePdfFile = (fileBuffer, originalName, mimeType) => {
    if (!originalName.toLowerCase().endsWith('.pdf')) {
        return {
            valid: false,
            error: 'Invalid file extension. Only .pdf files are accepted.',
        };
    }
    if (mimeType !== 'application/pdf') {
        return {
            valid: false,
            error: 'Invalid file MIME type. Expected application/pdf.',
        };
    }
    const maxSizeBytes = (env_1.env.RESUME_MAX_FILE_SIZE_MB || 10) * 1024 * 1024;
    if (fileBuffer.length > maxSizeBytes) {
        return {
            valid: false,
            error: `File size exceeds the maximum limit of ${env_1.env.RESUME_MAX_FILE_SIZE_MB || 10}MB.`,
        };
    }
    if (fileBuffer.length === 0) {
        return {
            valid: false,
            error: 'Uploaded file is empty (0 bytes).',
        };
    }
    const header = fileBuffer.slice(0, 5).toString('utf-8');
    if (header !== '%PDF-') {
        return {
            valid: false,
            error: 'Corrupted or fake PDF file. Header signature mismatch.',
        };
    }
    return { valid: true };
};
exports.validatePdfFile = validatePdfFile;
