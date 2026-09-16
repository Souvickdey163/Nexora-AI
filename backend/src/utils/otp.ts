import crypto from 'crypto';

/**
 * Generates a cryptographically secure 6-digit numeric OTP code.
 */
export const generateOtpCode = (): string => {
  const buffer = crypto.randomBytes(4);
  const number = buffer.readUInt32BE(0);
  const otp = (number % 900000) + 100000;
  return otp.toString();
};

/**
 * Hashes an OTP string using SHA-256 to ensure plain text OTP is never stored in DB.
 */
export const hashOtp = (otp: string): string => {
  return crypto.createHash('sha256').update(otp).digest('hex');
};

/**
 * Verifies an OTP string against its stored SHA-256 hash.
 */
export const verifyOtpHash = (otp: string, storedHash: string): boolean => {
  const calculatedHash = hashOtp(otp);
  if (!storedHash || calculatedHash.length !== storedHash.length) {
    return false;
  }
  return crypto.timingSafeEqual(
    Buffer.from(calculatedHash),
    Buffer.from(storedHash)
  );
};
