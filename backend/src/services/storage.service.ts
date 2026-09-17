import fs from 'fs';
import path from 'path';
import { env } from '../config/env';
import { logger } from '../utils/logger';

export interface IStorageProvider {
  upload(fileBuffer: Buffer, storageKey: string): Promise<string>;
  download(storageKey: string): Promise<Buffer>;
  delete(storageKey: string): Promise<void>;
  exists(storageKey: string): Promise<boolean>;
  getFilePath(storageKey: string): string;
}

export class LocalStorageProvider implements IStorageProvider {
  private baseDir: string;

  constructor(baseDir?: string) {
    this.baseDir = path.resolve(process.cwd(), baseDir || env.RESUME_UPLOAD_DIR);
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
  }

  public getFilePath(storageKey: string): string {
    const safeKey = path.normalize(storageKey).replace(/^(\.\.[\/\\])+/, '');
    const fullPath = path.join(this.baseDir, safeKey);
    
    // Prevent Path Traversal attacks
    if (!fullPath.startsWith(this.baseDir)) {
      throw new Error('Invalid storage path attempt.');
    }
    return fullPath;
  }

  public async upload(fileBuffer: Buffer, storageKey: string): Promise<string> {
    const targetPath = this.getFilePath(storageKey);
    const dir = path.dirname(targetPath);
    if (!fs.existsSync(dir)) {
      await fs.promises.mkdir(dir, { recursive: true });
    }
    await fs.promises.writeFile(targetPath, fileBuffer);
    logger.info(`💾 File stored securely at ${storageKey}`);
    return storageKey;
  }

  public async download(storageKey: string): Promise<Buffer> {
    const targetPath = this.getFilePath(storageKey);
    if (!fs.existsSync(targetPath)) {
      throw new Error(`File not found at key: ${storageKey}`);
    }
    return fs.promises.readFile(targetPath);
  }

  public async delete(storageKey: string): Promise<void> {
    const targetPath = this.getFilePath(storageKey);
    if (fs.existsSync(targetPath)) {
      await fs.promises.unlink(targetPath);
      logger.info(`🗑️ Deleted file at ${storageKey}`);
    }
  }

  public async exists(storageKey: string): Promise<boolean> {
    const targetPath = this.getFilePath(storageKey);
    return fs.existsSync(targetPath);
  }
}

export const storageService = new LocalStorageProvider();
