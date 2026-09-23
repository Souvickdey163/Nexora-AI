import { prisma } from '../../config/database';
import { storageService } from '../storage.service';
import { logger } from '../../utils/logger';

export class RecordingService {
  /**
   * Upload and record video stream associated with an interview session.
   * Ensures strict userId ownership verification.
   */
  public async uploadRecording(
    userId: string,
    interviewId: string,
    fileBuffer: Buffer,
    mimeType: string = 'video/webm',
    durationSeconds: number = 0
  ) {
    const interview = await prisma.interview.findFirst({
      where: { id: interviewId, userId },
    });

    if (!interview) {
      throw new Error('Interview session not found or unauthorized access.');
    }

    const storageKey = `interviews/${userId}/${interviewId}_${Date.now()}.webm`;
    await storageService.upload(fileBuffer, storageKey);

    const recording = await prisma.interviewRecording.upsert({
      where: { interviewId },
      update: {
        storageKey,
        mimeType,
        durationSeconds,
        fileSizeBytes: fileBuffer.length,
        status: 'SAVED',
      },
      create: {
        interviewId,
        userId,
        storageKey,
        mimeType,
        durationSeconds,
        fileSizeBytes: fileBuffer.length,
        status: 'SAVED',
      },
    });

    logger.info(`🎥 Video recording uploaded for interview ${interviewId} (Size: ${fileBuffer.length} bytes)`);

    return recording;
  }

  /**
   * Stream video buffer for playback ensuring strict user ownership.
   */
  public async getRecordingBuffer(userId: string, interviewId: string): Promise<{ buffer: Buffer; mimeType: string }> {
    const recording = await prisma.interviewRecording.findFirst({
      where: { interviewId, userId },
    });

    if (!recording) {
      throw new Error('Interview recording not found or unauthorized access.');
    }

    const buffer = await storageService.download(recording.storageKey);
    return {
      buffer,
      mimeType: recording.mimeType || 'video/webm',
    };
  }

  /**
   * Delete recording file and DB record securely.
   */
  public async deleteRecording(userId: string, interviewId: string): Promise<void> {
    const recording = await prisma.interviewRecording.findFirst({
      where: { interviewId, userId },
    });

    if (recording) {
      await storageService.delete(recording.storageKey);
      await prisma.interviewRecording.delete({ where: { id: recording.id } });
      logger.info(`🗑️ Deleted interview recording for ${interviewId}`);
    }
  }
}

export const recordingService = new RecordingService();
