import path from 'path';
import fs from 'fs';
import { prisma } from '../config/database';
import { LocalStorageProvider } from './storage.service';

const avatarStorage = new LocalStorageProvider('./uploads/avatars');

export class ProfileService {
  /**
   * Get complete user profile information.
   */
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        oauthAccounts: {
          select: {
            provider: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user) {
      const err: any = new Error('User account not found.');
      err.statusCode = 404;
      throw err;
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      name: user.name || `${user.firstName} ${user.lastName}`.trim(),
      avatar: user.avatar,
      avatarUrl: user.avatar,
      credits: user.credits,
      emailVerified: user.emailVerified,
      status: user.status,
      createdAt: user.createdAt,
      profile: user.profile,
      connectedAccounts: user.oauthAccounts.map((acc) => acc.provider),
    };
  }

  /**
   * Update user profile details.
   */
  async updateProfile(
    userId: string,
    data: {
      firstName?: string;
      lastName?: string;
      headline?: string;
      bio?: string;
      targetRole?: string;
      education?: string;
      location?: string;
      websiteUrl?: string;
      githubUrl?: string;
      linkedinUrl?: string;
    }
  ) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      const err: any = new Error('User not found.');
      err.statusCode = 404;
      throw err;
    }

    // Update User name if provided
    let updatedUser = user;
    if (data.firstName !== undefined || data.lastName !== undefined) {
      const newFirstName = data.firstName ?? user.firstName;
      const newLastName = data.lastName ?? user.lastName;
      updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          firstName: newFirstName,
          lastName: newLastName,
          name: `${newFirstName} ${newLastName}`.trim(),
        },
      });
    }

    // Upsert UserProfile record
    const profile = await prisma.userProfile.upsert({
      where: { userId },
      create: {
        userId,
        headline: data.headline,
        bio: data.bio,
        targetRole: data.targetRole,
        education: data.education,
        location: data.location,
        websiteUrl: data.websiteUrl,
        githubUrl: data.githubUrl,
        linkedinUrl: data.linkedinUrl,
      },
      update: {
        headline: data.headline !== undefined ? data.headline : undefined,
        bio: data.bio !== undefined ? data.bio : undefined,
        targetRole: data.targetRole !== undefined ? data.targetRole : undefined,
        education: data.education !== undefined ? data.education : undefined,
        location: data.location !== undefined ? data.location : undefined,
        websiteUrl: data.websiteUrl !== undefined ? data.websiteUrl : undefined,
        githubUrl: data.githubUrl !== undefined ? data.githubUrl : undefined,
        linkedinUrl: data.linkedinUrl !== undefined ? data.linkedinUrl : undefined,
      },
    });

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      name: updatedUser.name || `${updatedUser.firstName} ${updatedUser.lastName}`.trim(),
      avatar: updatedUser.avatar,
      avatarUrl: updatedUser.avatar,
      credits: updatedUser.credits,
      profile,
    };
  }

  /**
   * Upload profile avatar image (Email/Password users or explicit upload).
   */
  async uploadAvatar(
    userId: string,
    fileBuffer: Buffer,
    mimeType: string,
    originalName: string
  ) {
    // Validate file format
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedMimeTypes.includes(mimeType)) {
      const err: any = new Error('Invalid image format. Only JPG, PNG, and WEBP images are allowed.');
      err.statusCode = 400;
      throw err;
    }

    const ext = mimeType === 'image/jpeg' ? 'jpg' : mimeType === 'image/png' ? 'png' : 'webp';
    const storageKey = `avatar_${userId}_${Date.now()}.${ext}`;

    await avatarStorage.upload(fileBuffer, storageKey);

    // Save avatar URL path
    const avatarUrl = `/api/profile/avatar/${storageKey}`;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { avatar: avatarUrl },
    });

    return {
      avatarUrl: updatedUser.avatar,
      user: {
        id: updatedUser.id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        name: updatedUser.name,
        avatar: updatedUser.avatar,
        avatarUrl: updatedUser.avatar,
        credits: updatedUser.credits,
      },
    };
  }

  /**
   * Download / Stream avatar file securely.
   */
  async getAvatarFile(filename: string): Promise<Buffer> {
    return avatarStorage.download(filename);
  }
}

export const profileService = new ProfileService();
