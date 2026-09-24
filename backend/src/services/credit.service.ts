import { prisma } from '../config/database';
import { CreditTransactionType } from '@prisma/client';

export class CreditService {
  /**
   * Automatically grant 10 free welcome credits to a newly registered user or existing user who hasn't received it yet.
   * Guaranteed to execute exactly once per user.
   */
  async grantWelcomeBonus(userId: string) {
    return prisma.$transaction(async (tx) => {
      const existingBonus = await tx.creditTransaction.findFirst({
        where: {
          userId,
          type: CreditTransactionType.WELCOME_BONUS,
        },
      });

      if (existingBonus) {
        const user = await tx.user.findUnique({
          where: { id: userId },
          select: { credits: true },
        });
        return { granted: false, credits: user?.credits ?? 10 };
      }

      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { credits: true },
      });

      const balanceBefore = user?.credits ?? 0;
      const amount = 10;
      const balanceAfter = balanceBefore + amount;

      await tx.user.update({
        where: { id: userId },
        data: { credits: balanceAfter },
      });

      await tx.creditTransaction.create({
        data: {
          userId,
          type: CreditTransactionType.WELCOME_BONUS,
          amount,
          balanceBefore,
          balanceAfter,
          source: 'SYSTEM',
          description: 'Welcome Bonus +10 Credits',
          status: 'COMPLETED',
        },
      });

      return { granted: true, credits: balanceAfter };
    });
  }

  /**
   * Atomic backend credit deduction.
   * Throws an INSUFFICIENT_CREDITS (402) error if the user balance is less than required cost.
   */
  async deductCredits(
    userId: string,
    cost: number,
    source: string,
    description: string
  ) {
    if (cost <= 0) return { balanceBefore: 0, balanceAfter: 0 };

    // First check if user needs welcome bonus initialized
    await this.ensureWelcomeBonus(userId);

    return prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { id: true, credits: true },
      });

      if (!user) {
        const err: any = new Error('User not found');
        err.statusCode = 404;
        throw err;
      }

      if (user.credits < cost) {
        const err: any = new Error("You've run out of credits. Purchase more credits to continue using Nexora AI.");
        err.code = 'INSUFFICIENT_CREDITS';
        err.statusCode = 402;
        err.requiredCredits = cost;
        err.currentCredits = user.credits;
        throw err;
      }

      const balanceBefore = user.credits;
      const balanceAfter = balanceBefore - cost;

      await tx.user.update({
        where: { id: userId },
        data: { credits: balanceAfter },
      });

      await tx.creditTransaction.create({
        data: {
          userId,
          type: CreditTransactionType.AI_USAGE,
          amount: -cost,
          balanceBefore,
          balanceAfter,
          source,
          description,
          status: 'COMPLETED',
        },
      });

      return { balanceBefore, balanceAfter };
    });
  }

  /**
   * Atomic addition of credits (e.g. from Razorpay purchase, admin adjustment, or refund).
   */
  async addCredits(
    userId: string,
    amount: number,
    type: CreditTransactionType,
    source: string,
    description: string,
    razorpayOrderId?: string,
    razorpayPaymentId?: string
  ) {
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { id: true, credits: true },
      });

      if (!user) {
        throw new Error('User not found for credit grant.');
      }

      const balanceBefore = user.credits;
      const balanceAfter = balanceBefore + amount;

      await tx.user.update({
        where: { id: userId },
        data: { credits: balanceAfter },
      });

      await tx.creditTransaction.create({
        data: {
          userId,
          type,
          amount,
          balanceBefore,
          balanceAfter,
          source,
          description,
          razorpayOrderId,
          razorpayPaymentId,
          status: 'COMPLETED',
        },
      });

      return { balanceBefore, balanceAfter };
    });
  }

  /**
   * Helper to ensure welcome bonus exists for user.
   */
  async ensureWelcomeBonus(userId: string) {
    const existing = await prisma.creditTransaction.findFirst({
      where: {
        userId,
        type: CreditTransactionType.WELCOME_BONUS,
      },
    });

    if (!existing) {
      await this.grantWelcomeBonus(userId);
    }
  }

  /**
   * Retrieve current user credit balance.
   */
  async getUserBalance(userId: string): Promise<number> {
    await this.ensureWelcomeBonus(userId);
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true },
    });
    return user?.credits ?? 0;
  }

  /**
   * Retrieve credit transaction history ledger.
   */
  async getTransactionHistory(userId: string, limit = 50) {
    return prisma.creditTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}

export const creditService = new CreditService();
