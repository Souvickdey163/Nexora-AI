"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storageService = exports.LocalStorageProvider = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const env_1 = require("../config/env");
const logger_1 = require("../utils/logger");
class LocalStorageProvider {
    baseDir;
    constructor(baseDir) {
        this.baseDir = path_1.default.resolve(process.cwd(), baseDir || env_1.env.RESUME_UPLOAD_DIR);
        if (!fs_1.default.existsSync(this.baseDir)) {
            fs_1.default.mkdirSync(this.baseDir, { recursive: true });
        }
    }
    getFilePath(storageKey) {
        const safeKey = path_1.default.normalize(storageKey).replace(/^(\.\.[\/\\])+/, '');
        const fullPath = path_1.default.join(this.baseDir, safeKey);
        if (!fullPath.startsWith(this.baseDir)) {
            throw new Error('Invalid storage path attempt.');
        }
        return fullPath;
    }
    async upload(fileBuffer, storageKey) {
        const targetPath = this.getFilePath(storageKey);
        const dir = path_1.default.dirname(targetPath);
        if (!fs_1.default.existsSync(dir)) {
            await fs_1.default.promises.mkdir(dir, { recursive: true });
        }
        await fs_1.default.promises.writeFile(targetPath, fileBuffer);
        logger_1.logger.info(`💾 File stored securely at ${storageKey}`);
        return storageKey;
    }
    async download(storageKey) {
        const targetPath = this.getFilePath(storageKey);
        if (!fs_1.default.existsSync(targetPath)) {
            throw new Error(`File not found at key: ${storageKey}`);
        }
        return fs_1.default.promises.readFile(targetPath);
    }
    async delete(storageKey) {
        const targetPath = this.getFilePath(storageKey);
        if (fs_1.default.existsSync(targetPath)) {
            await fs_1.default.promises.unlink(targetPath);
            logger_1.logger.info(`🗑️ Deleted file at ${storageKey}`);
        }
    }
    async exists(storageKey) {
        const targetPath = this.getFilePath(storageKey);
        return fs_1.default.existsSync(targetPath);
    }
}
exports.LocalStorageProvider = LocalStorageProvider;
exports.storageService = new LocalStorageProvider();
