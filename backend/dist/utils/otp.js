"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtpHash = exports.hashOtp = exports.generateOtpCode = void 0;
const crypto_1 = __importDefault(require("crypto"));
const generateOtpCode = () => {
    const buffer = crypto_1.default.randomBytes(4);
    const number = buffer.readUInt32BE(0);
    const otp = (number % 900000) + 100000;
    return otp.toString();
};
exports.generateOtpCode = generateOtpCode;
const hashOtp = (otp) => {
    return crypto_1.default.createHash('sha256').update(otp).digest('hex');
};
exports.hashOtp = hashOtp;
const verifyOtpHash = (otp, storedHash) => {
    const calculatedHash = (0, exports.hashOtp)(otp);
    if (!storedHash || calculatedHash.length !== storedHash.length) {
        return false;
    }
    return crypto_1.default.timingSafeEqual(Buffer.from(calculatedHash), Buffer.from(storedHash));
};
exports.verifyOtpHash = verifyOtpHash;
