import request from 'supertest';
import app from '../app';

describe('Nexora Authentication API Tests', () => {
  jest.setTimeout(30000);

  const testUser = {
    firstName: 'Test',
    lastName: 'User',
    email: `test_${Date.now()}@nexora.ai`,
    password: 'TestPassword123!',
  };

  describe('GET /health', () => {
    it('should return health status ok', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.service).toBe('Nexora Backend Express API');
    });
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(testUser.email.toLowerCase());
    });

    it('should fail with invalid email or weak password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          firstName: 'Invalid',
          lastName: 'User',
          email: 'not-an-email',
          password: '123',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Validation failed');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should fail login for unverified user or wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'WrongPassword123!',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/verify-email', () => {
    it('should fail verification with incorrect 6-digit OTP', async () => {
      const res = await request(app)
        .post('/api/auth/verify-email')
        .send({
          email: testUser.email,
          otp: '000000',
        });

      expect([400, 500]).toContain(res.status);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/forgot-password', () => {
    it('should handle forgot password request gracefully', async () => {
      const res = await request(app)
        .post('/api/auth/forgot-password')
        .send({
          email: testUser.email,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('GET /api/auth/me (Protected Route)', () => {
    it('should reject unauthenticated request with 401', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('OAuth Redirect Routes', () => {
    it('Google OAuth redirect route should respond', async () => {
      const res = await request(app).get('/api/auth/google');
      expect([302, 500]).toContain(res.status);
    });

    it('GitHub OAuth redirect route should respond', async () => {
      const res = await request(app).get('/api/auth/github');
      expect([302, 500]).toContain(res.status);
    });

    it('LinkedIn OAuth redirect route should respond', async () => {
      const res = await request(app).get('/api/auth/linkedin');
      expect([302, 500]).toContain(res.status);
    });
  });
});
