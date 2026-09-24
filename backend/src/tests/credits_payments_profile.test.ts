import request from 'supertest';
import app from '../app';
import { prisma } from '../config/database';
import { tokenService } from '../services/token.service';
import { creditService } from '../services/credit.service';
import { paymentService } from '../services/payment.service';
import { CreditTransactionType, UserStatus } from '@prisma/client';

describe('Credit System, Razorpay Payments, & Profile API Tests', () => {
  jest.setTimeout(30000);

  let userId: string;
  let userEmail: string;
  let accessToken: string;

  beforeAll(async () => {
    userEmail = `test_credit_${Date.now()}@nexora.ai`;
    const user = await prisma.user.create({
      data: {
        email: userEmail,
        firstName: 'Credit',
        lastName: 'Tester',
        name: 'Credit Tester',
        emailVerified: true,
        status: UserStatus.ACTIVE,
      },
    });
    userId = user.id;

    // Issue test access token
    accessToken = tokenService.generateAccessToken({
      userId,
      email: userEmail,
      status: UserStatus.ACTIVE,
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { email: { contains: 'test_credit_' } },
    });
  });

  describe('PART 1 — Welcome Bonus & Credit Balance', () => {
    it('should grant exactly 10 welcome bonus credits once', async () => {
      const result1 = await creditService.grantWelcomeBonus(userId);
      expect(result1.granted).toBe(true);
      expect(result1.credits).toBe(10);

      // Attempt second welcome bonus grant - should be ignored (idempotent)
      const result2 = await creditService.grantWelcomeBonus(userId);
      expect(result2.granted).toBe(false);
      expect(result2.credits).toBe(10);

      const balance = await creditService.getUserBalance(userId);
      expect(balance).toBe(10);
    });

    it('should return balance via GET /api/credits/balance', async () => {
      const res = await request(app)
        .get('/api/credits/balance')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.credits).toBe(10);
    });

    it('should return transaction ledger via GET /api/credits/history', async () => {
      const res = await request(app)
        .get('/api/credits/history')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.transactions)).toBe(true);
      expect(res.body.data.transactions[0].type).toBe('WELCOME_BONUS');
      expect(res.body.data.transactions[0].amount).toBe(10);
    });

    it('should atomically deduct credits for AI actions', async () => {
      const deductRes = await creditService.deductCredits(
        userId,
        2,
        'RESUME_AI',
        'Test Resume Analysis'
      );

      expect(deductRes.balanceBefore).toBe(10);
      expect(deductRes.balanceAfter).toBe(8);

      const currentBalance = await creditService.getUserBalance(userId);
      expect(currentBalance).toBe(8);
    });

    it('should reject AI operations when balance is insufficient (402 INSUFFICIENT_CREDITS)', async () => {
      // Drain credits to 0
      await creditService.deductCredits(userId, 8, 'TEST_DRAIN', 'Drain credits for test');

      const zeroBalance = await creditService.getUserBalance(userId);
      expect(zeroBalance).toBe(0);

      // Attempt 2-credit operation with 0 balance
      await expect(
        creditService.deductCredits(userId, 2, 'RESUME_AI', 'Test Insufficient')
      ).rejects.toThrow();
    });
  });

  describe('PART 2 — Razorpay Payment & Verification', () => {
    let orderId: string;

    it('should return credit packages via GET /api/payments/packages', async () => {
      const res = await request(app).get('/api/payments/packages');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.packages.length).toBeGreaterThan(0);
    });

    it('should create Razorpay order via POST /api/payments/create-order', async () => {
      const res = await request(app)
        .post('/api/payments/create-order')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ packageId: 'STARTER' });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.orderId).toBeDefined();
      expect(res.body.data.amount).toBe(19900);
      expect(res.body.data.creditsGranted).toBe(50);

      orderId = res.body.data.orderId;
    });

    it('should verify payment and atomically add 50 credits', async () => {
      const paymentId = `pay_test_${Date.now()}`;
      const res = await request(app)
        .post('/api/payments/verify-payment')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          razorpayOrderId: orderId,
          razorpayPaymentId: paymentId,
          razorpaySignature: 'mock_signature_test',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.creditsGranted).toBe(50);
      expect(res.body.data.credits).toBe(50);

      const balance = await creditService.getUserBalance(userId);
      expect(balance).toBe(50);
    });

    it('should prevent duplicate payment verification (Idempotency)', async () => {
      const paymentId = `pay_test_${Date.now()}`;
      const res = await request(app)
        .post('/api/payments/verify-payment')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          razorpayOrderId: orderId,
          razorpayPaymentId: paymentId,
          razorpaySignature: 'mock_signature_test',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('already processed');

      // Balance must remain 50, NOT 100!
      const balance = await creditService.getUserBalance(userId);
      expect(balance).toBe(50);
    });
  });

  describe('PART 3 — Profile & Avatar Management', () => {
    it('should fetch user profile via GET /api/profile', async () => {
      const res = await request(app)
        .get('/api/profile')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(userEmail);
      expect(res.body.data.user.credits).toBe(50);
    });

    it('should update profile fields via PUT /api/profile', async () => {
      const res = await request(app)
        .put('/api/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          headline: 'Senior Fullstack Engineer',
          bio: 'Passionate developer focusing on scalable cloud platforms.',
          targetRole: 'Lead Software Architect',
          education: 'B.Tech Computer Science',
          location: 'San Francisco, CA',
          websiteUrl: 'https://nexora.ai',
          githubUrl: 'https://github.com/nexora',
          linkedinUrl: 'https://linkedin.com/in/nexora',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.profile.headline).toBe('Senior Fullstack Engineer');
      expect(res.body.data.user.profile.location).toBe('San Francisco, CA');
    });

    it('should upload profile avatar photo via POST /api/profile/avatar', async () => {
      // Create a 1x1 dummy PNG buffer
      const dummyPngBuffer = Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        'base64'
      );

      const res = await request(app)
        .post('/api/profile/avatar')
        .set('Authorization', `Bearer ${accessToken}`)
        .attach('avatar', dummyPngBuffer, 'avatar.png');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.avatarUrl).toContain('/api/profile/avatar/');
    });
  });
});
