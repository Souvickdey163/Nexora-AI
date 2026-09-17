import { env } from '../config/env';

export interface PDFValidationResult {
  valid: boolean;
  error?: string;
}

export const validatePdfFile = (
  fileBuffer: Buffer,
  originalName: string,
  mimeType: string
): PDFValidationResult => {
  // 1. File Extension Validation
  if (!originalName.toLowerCase().endsWith('.pdf')) {
    return {
      valid: false,
      error: 'Invalid file extension. Only .pdf files are accepted.',
    };
  }

  // 2. MIME Type Validation
  if (mimeType !== 'application/pdf') {
    return {
      valid: false,
      error: 'Invalid file MIME type. Expected application/pdf.',
    };
  }

  // 3. File Size Validation
  const maxSizeBytes = (env.RESUME_MAX_FILE_SIZE_MB || 10) * 1024 * 1024;
  if (fileBuffer.length > maxSizeBytes) {
    return {
      valid: false,
      error: `File size exceeds the maximum limit of ${env.RESUME_MAX_FILE_SIZE_MB || 10}MB.`,
    };
  }

  if (fileBuffer.length === 0) {
    return {
      valid: false,
      error: 'Uploaded file is empty (0 bytes).',
    };
  }

  // 4. Magic-Byte Signature Validation (%PDF-)
  // Magic bytes for PDF are hex: 25 50 44 46 2D (%PDF-)
  const header = fileBuffer.slice(0, 5).toString('utf-8');
  if (header !== '%PDF-') {
    return {
      valid: false,
      error: 'Corrupted or fake PDF file. Header signature mismatch.',
    };
  }

  return { valid: true };
};
