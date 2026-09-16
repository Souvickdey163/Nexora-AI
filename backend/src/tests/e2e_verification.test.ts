import request from 'supertest';
import app from '../app';
import { prisma } from '../config/database';
import { env } from '../config/env';
import { hashOtp } from '../utils/otp';
import bcrypt from 'bcryptjs';

describe('Comprehensive End-to-End Authentication & Database Verification', () => {
  jest.setTimeout(30000);

  const e2eUser = {
    firstName: 'Souvick',
    lastName: 'Dey',
    email: `e2e_test_${Date.now()}@nexora.ai`,
    password: 'SecurePassword123!',
    newPassword: 'NewSecurePassword456!',
  };

  let userJwtToken = '';

  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    // Cleanup test data
    await prisma.otpVerification.deleteMany({ where: { email: e2eUser.email } });
    await prisma.session.deleteMany({
      where: { user: { email: e2eUser.email } },
    });
    await prisma.userProfile.deleteMany({
      where: { user: { email: e2eUser.email } },
    });
    await prisma.user.deleteMany({ where: { email: e2eUser.email } });
    await prisma.$disconnect();
  });

  // 1. Health Check
  test('1. GET /health should respond with status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('Nexora Backend Express API');
  });

  // 2. Negative Validation Cases
  test('2. POST /api/auth/register should fail on invalid email and weak password', async () => {
    const resInvalidEmail = await request(app).post('/api/auth/register').send({
      firstName: 'Test',
      lastName: 'User',
      email: 'invalid-email-format',
      password: 'SecurePassword123!',
    });
    expect(resInvalidEmail.status).toBe(400);

    const resWeakPassword = await request(app).post('/api/auth/register').send({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@nexora.ai',
      password: '123',
    });
    expect(resWeakPassword.status).toBe(400);
  });

  // 3. User Registration
  test('3. POST /api/auth/register creates unverified user and hashes OTP in database', async () => {
    const res = await request(app).post('/api/auth/register').send(e2eUser);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(e2eUser.email.toLowerCase());

    // Verify DB user state
    const dbUser = await prisma.user.findUnique({
      where: { email: e2eUser.email.toLowerCase() },
    });
    expect(dbUser).not.toBeNull();
    expect(dbUser?.emailVerified).toBe(false);
    expect(dbUser?.status).toBe('UNVERIFIED');
    expect(dbUser?.passwordHash).not.toBe(e2eUser.password);

    // Verify bcrypt hash validity
    const isPasswordValid = await bcrypt.compare(e2eUser.password, dbUser!.passwordHash!);
    expect(isPasswordValid).toBe(true);

    // Verify DB OTP record state (must be hashed, not plaintext)
    const dbOtp = await prisma.otpVerification.findFirst({
      where: { email: e2eUser.email.toLowerCase(), type: 'REGISTRATION' },
      orderBy: { createdAt: 'desc' },
    });
    expect(dbOtp).not.toBeNull();
    expect(dbOtp?.verified).toBe(false);
    expect(dbOtp?.otpHash).not.toHaveLength(6); // Must be SHA-256 hash
    expect(dbOtp?.expiresAt.getTime()).toBeGreaterThan(Date.now());
  });

  // 4. Duplicate Registration
  test('4. POST /api/auth/register with existing unverified email updates account and resends OTP', async () => {
    const res = await request(app).post('/api/auth/register').send(e2eUser);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  // 5. OTP Resend Cooldown
  test('5. POST /api/auth/resend-verification-otp within 60 seconds triggers cooldown rate-limit', async () => {
    const res = await request(app)
      .post('/api/auth/resend-verification-otp')
      .send({ email: e2eUser.email });
    expect(res.status).toBe(500);
    expect(res.body.error).toContain('Please wait');
  });

  // 6. Wrong OTP Verification
  test('6. POST /api/auth/verify-email with wrong OTP code fails and tracks attempts', async () => {
    const res = await request(app).post('/api/auth/verify-email').send({
      email: e2eUser.email,
      otp: '999999',
    });
    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('Invalid OTP code');

    const dbOtp = await prisma.otpVerification.findFirst({
      where: { email: e2eUser.email.toLowerCase(), type: 'REGISTRATION' },
      orderBy: { createdAt: 'desc' },
    });
    expect(dbOtp?.attempts).toBeGreaterThan(0);
  });

  // 7. Login Unverified User
  test('7. POST /api/auth/login for unverified user fails with EMAIL_UNVERIFIED code', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: e2eUser.email,
      password: e2eUser.password,
    });
    expect(res.status).toBe(403);
    expect(res.body.code).toBe('EMAIL_UNVERIFIED');
  });

  // 8. Correct OTP Verification & Account Activation
  test('8. POST /api/auth/verify-email with valid OTP code activates user account and issues JWT', async () => {
    // Retrieve the active OTP record from DB
    const dbOtp = await prisma.otpVerification.findFirst({
      where: { email: e2eUser.email.toLowerCase(), type: 'REGISTRATION', verified: false },
      orderBy: { createdAt: 'desc' },
    });
    expect(dbOtp).not.toBeNull();

    // Set test OTP hash for test execution
    const validTestCode = '123456';
    const testHash = hashOtp(validTestCode);
    await prisma.otpVerification.update({
      where: { id: dbOtp!.id },
      data: { otpHash: testHash },
    });

    const res = await request(app).post('/api/auth/verify-email').send({
      email: e2eUser.email,
      otp: validTestCode,
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.emailVerified).toBe(true);
    expect(res.body.data.user.status).toBe('ACTIVE');
    expect(res.body.data.tokens.accessToken).toBeDefined();

    // Store JWT token for protected route testing
    userJwtToken = res.body.data.tokens.accessToken;

    // Verify DB user updated
    const dbUser = await prisma.user.findUnique({
      where: { email: e2eUser.email.toLowerCase() },
    });
    expect(dbUser?.emailVerified).toBe(true);
    expect(dbUser?.status).toBe('ACTIVE');
  });

  // 9. Login Verified User
  test('9. POST /api/auth/login with valid password succeeds and creates session record', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: e2eUser.email,
      password: e2eUser.password,
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.tokens.accessToken).toBeDefined();

    // Verify session record created in PostgreSQL
    const dbSessions = await prisma.session.findMany({
      where: { user: { email: e2eUser.email.toLowerCase() } },
    });
    expect(dbSessions.length).toBeGreaterThan(0);
  });

  // 10. Login Wrong Password
  test('10. POST /api/auth/login with wrong password fails with 400', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: e2eUser.email,
      password: 'WrongPassword999!',
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('Invalid email or password credentials.');
  });

  // 11. Protected Route /api/auth/me
  test('11. GET /api/auth/me protects unauthenticated access and allows valid Bearer token', async () => {
    const unauthRes = await request(app).get('/api/auth/me');
    expect(unauthRes.status).toBe(401);

    const authRes = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${userJwtToken}`);
    expect(authRes.status).toBe(200);
    expect(authRes.body.success).toBe(true);
    expect(authRes.body.data.user.email).toBe(e2eUser.email.toLowerCase());
  });

  // 12. Password Reset Flow (Forgot Password -> Reset Password)
  test('12. Password Reset Flow: Forgot Password, Verify Reset OTP, Reset Password', async () => {
    // Step A: Forgot Password
    const forgotRes = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: e2eUser.email });
    expect(forgotRes.status).toBe(200);

    // Step B: Set test OTP hash
    const resetOtp = await prisma.otpVerification.findFirst({
      where: { email: e2eUser.email.toLowerCase(), type: 'PASSWORD_RESET', verified: false },
      orderBy: { createdAt: 'desc' },
    });
    expect(resetOtp).not.toBeNull();

    const testResetCode = '654321';
    await prisma.otpVerification.update({
      where: { id: resetOtp!.id },
      data: { otpHash: hashOtp(testResetCode) },
    });

    // Step C: Verify Reset OTP
    const verifyResetRes = await request(app).post('/api/auth/verify-reset-otp').send({
      email: e2eUser.email,
      otp: testResetCode,
    });
    expect(verifyResetRes.status).toBe(200);

    // Step D: Reset Password
    const resetRes = await request(app).post('/api/auth/reset-password').send({
      email: e2eUser.email,
      otp: testResetCode,
      newPassword: e2eUser.newPassword,
    });
    expect(resetRes.status).toBe(200);

    // Step E: Login with new password
    const loginNewPasswordRes = await request(app).post('/api/auth/login').send({
      email: e2eUser.email,
      password: e2eUser.newPassword,
    });
    expect(loginNewPasswordRes.status).toBe(200);
    expect(loginNewPasswordRes.body.success).toBe(true);
  });

  // 13. Logout
  test('13. POST /api/auth/logout revokes user session', async () => {
    const logoutRes = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${userJwtToken}`);

    expect(logoutRes.status).toBe(200);
    expect(logoutRes.body.success).toBe(true);
  });

  // 14. Check SMTP Credentials Configuration
  test('14. SMTP Configuration Status Check', () => {
    const isSmtpConfigured = Boolean(env.SMTP_USER && env.SMTP_PASSWORD);
    console.log(`\n📧 SMTP Configuration Status: ${isSmtpConfigured ? 'CONFIGURED' : 'NOT CONFIGURED'}`);
    if (!isSmtpConfigured) {
      console.log('⚠️ SMTP credentials (SMTP_USER & SMTP_PASSWORD) are missing in .env.');
    }
  });
});
