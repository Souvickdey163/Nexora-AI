import pdfParse from 'pdf-parse';
import { logger } from './logger';

export interface PDFExtractionResult {
  success: boolean;
  text?: string;
  pageCount?: number;
  error?: string;
}

export const extractTextFromPdf = async (fileBuffer: Buffer): Promise<PDFExtractionResult> => {
  try {
    const data = await pdfParse(fileBuffer);
    const cleanedText = (data.text || '').trim();

    if (!cleanedText || cleanedText.length < 20) {
      return {
        success: false,
        error: 'This PDF appears to be scanned or image-based with no extractable text. Please upload a text-based PDF resume.',
        pageCount: data.numpages || 0,
      };
    }

    const crypto = await import('crypto');
    const textHash = crypto.createHash('sha256').update(cleanedText).digest('hex').substring(0, 12);
    const snippet = cleanedText.substring(0, 100).replace(/[\r\n]+/g, ' ');

    logger.info(`📄 PDF text extracted successfully | Length: ${cleanedText.length} chars | Hash: ${textHash} | Pages: ${data.numpages} | Snippet: "${snippet}..."`);
    return {
      success: true,
      text: cleanedText,
      pageCount: data.numpages,
    };
  } catch (err: any) {
    logger.error(`❌ PDF extraction error: ${err.message}`);
    
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
