"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractTextFromPdf = void 0;
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const logger_1 = require("./logger");
const extractTextFromPdf = async (fileBuffer) => {
    try {
        const data = await (0, pdf_parse_1.default)(fileBuffer);
        const cleanedText = (data.text || '').trim();
        if (!cleanedText || cleanedText.length < 20) {
            return {
                success: false,
                error: 'This PDF appears to be scanned or image-based with no extractable text. Please upload a text-based PDF resume.',
                pageCount: data.numpages || 0,
            };
        }
        logger_1.logger.info(`📄 PDF text successfully extracted (${cleanedText.length} chars, ${data.numpages} pages)`);
        return {
            success: true,
            text: cleanedText,
            pageCount: data.numpages,
        };
    }
    catch (err) {
        logger_1.logger.error(`❌ PDF extraction error: ${err.message}`);
        if (err.message && err.message.toLowerCase().includes('password')) {
            return {
                success: false,
                error: 'The uploaded PDF is password-protected. Please remove password protection and try again.',
            };
        }
        return {
            success: false,
            error: 'Failed to extract text from PDF. The document may be corrupted or malformed.',
        };
    }
};
exports.extractTextFromPdf = extractTextFromPdf;
