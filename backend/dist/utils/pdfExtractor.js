"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
        const crypto = await Promise.resolve().then(() => __importStar(require('crypto')));
        const textHash = crypto.createHash('sha256').update(cleanedText).digest('hex').substring(0, 12);
        const snippet = cleanedText.substring(0, 100).replace(/[\r\n]+/g, ' ');
        logger_1.logger.info(`📄 PDF text extracted successfully | Length: ${cleanedText.length} chars | Hash: ${textHash} | Pages: ${data.numpages} | Snippet: "${snippet}..."`);
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
