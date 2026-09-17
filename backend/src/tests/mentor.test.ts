import request from 'supertest';
import app from '../app';
import { prisma } from '../config/database';
import { tokenService } from '../services/token.service';
import { aiClient } from '../services/ai.client';
import { UserStatus } from '@prisma/client';

describe('Nexora AI Mentor & Career Chatbot API Tests', () => {
  jest.setTimeout(30000);

  let userA: any;
  let userB: any;
  let tokenA: string;
  let tokenB: string;
  let testConversationId: string;

  beforeAll(async () => {
    // Setup Test User A
    userA = await prisma.user.create({
      data: {
        email: `mentor_usera_${Date.now()}@nexora.ai`,
        firstName: 'MentorUserA',
        lastName: 'Tester',
        emailVerified: true,
        status: UserStatus.ACTIVE,
      },
    });
    tokenA = tokenService.generateAccessToken({ userId: userA.id, email: userA.email, status: userA.status });

    // Setup Test User B (for cross-user testing)
    userB = await prisma.user.create({
      data: {
        email: `mentor_userb_${Date.now()}@nexora.ai`,
        firstName: 'MentorUserB',
        lastName: 'Tester',
        emailVerified: true,
        status: UserStatus.ACTIVE,
      },
    });
    tokenB = tokenService.generateAccessToken({ userId: userB.id, email: userB.email, status: userB.status });
  });

  beforeEach(() => {
    // Override sendMentorChat on aiClient before each test
    aiClient.sendMentorChat = jest.fn(async (userMessage: string) => {
      if (userMessage.includes('TRIGGER_429_QUOTA')) {
        throw new Error('AI Mentor is temporarily unavailable because the free AI quota has been reached. Please try again later.');
      }
      if (userMessage.includes('TRIGGER_GEMINI_ERROR')) {
        throw new Error('Gemini API internal service connection failure.');
      }
      return {
        message: `Mocked AI Mentor response for: "${userMessage}". Priority focus: Master DSA & System Design.`,
        model: 'gemini-2.5-flash',
        provider: 'gemini',
      };
    });
  });

  afterAll(async () => {
    // Cleanup created test records
    await prisma.mentorMessage.deleteMany({
      where: { conversation: { userId: { in: [userA.id, userB.id] } } },
    });
    await prisma.mentorConversation.deleteMany({
      where: { userId: { in: [userA.id, userB.id] } },
    });
    await prisma.user.deleteMany({
      where: { id: { in: [userA.id, userB.id] } },
    });
  });

  // 1. Create Conversation
  it('1. should create a new mentor conversation for authenticated user', async () => {
    const res = await request(app)
      .post('/api/mentor/conversations')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ title: 'System Design Roadmap' });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('System Design Roadmap');
    expect(res.body.userId).toBe(userA.id);

    testConversationId = res.body.id;
  });

  // 2. List Conversations
  it('2. should list all conversations owned by User A', async () => {
    const res = await request(app)
      .get('/api/mentor/conversations')
      .set('Authorization', `Bearer ${tokenA}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    expect(res.body[0].userId).toBe(userA.id);
  });

  // 3. Get Conversation by ID
  it('3. should retrieve a single conversation with messages for User A', async () => {
    const res = await request(app)
      .get(`/api/mentor/conversations/${testConversationId}`)
      .set('Authorization', `Bearer ${tokenA}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(testConversationId);
    expect(Array.isArray(res.body.messages)).toBe(true);
  });

  // 5, 6, 7 & 8. Send Message, Receive AI Response, Conversation Persistence, History Retrieval
  it('5-8. should send a user message, return mocked AI response, and persist history in DB', async () => {
    const res = await request(app)
      .post('/api/mentor/chat')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        conversationId: testConversationId,
        message: 'How do I prepare for Senior Backend Engineer roles?',
      });

    expect(res.status).toBe(200);
    expect(res.body.conversationId).toBe(testConversationId);
    expect(res.body.userMessage.content).toBe('How do I prepare for Senior Backend Engineer roles?');
    expect(res.body.assistantMessage.role).toBe('ASSISTANT');
    expect(res.body.assistantMessage.content).toContain('Mocked AI Mentor response');
    expect(res.body.model).toBe('gemini-2.5-flash');

    // Verify retrieval after refresh
    const getRes = await request(app)
      .get(`/api/mentor/conversations/${testConversationId}/messages`)
      .set('Authorization', `Bearer ${tokenA}`);

    expect(getRes.status).toBe(200);
    expect(getRes.body.length).toBe(2); // User + Assistant messages
  });

  // 9. Unauthorized Access
  it('9. should reject unauthenticated request with 401', async () => {
    const res = await request(app)
      .post('/api/mentor/chat')
      .send({ message: 'Hello AI' });

    expect(res.status).toBe(401);
  });

  // 10. Cross-User Conversation Access
  it('10. should prevent User B from reading or modifying User A conversation', async () => {
    // User B attempts to access User A's conversation
    const getRes = await request(app)
      .get(`/api/mentor/conversations/${testConversationId}`)
      .set('Authorization', `Bearer ${tokenB}`);

    expect(getRes.status).toBe(404);

    // User B attempts to delete User A's conversation
    const delRes = await request(app)
      .delete(`/api/mentor/conversations/${testConversationId}`)
      .set('Authorization', `Bearer ${tokenB}`);

    expect(delRes.status).toBe(404);
  });

  // 11. Invalid Message Validation
  it('11. should reject empty messages with status 400', async () => {
    const res = await request(app)
      .post('/api/mentor/chat')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ message: '   ' });

    expect(res.status).toBe(400);
  });

  // 13. Gemini API Error Handling
  it('13. should handle Gemini general API errors gracefully', async () => {
    const res = await request(app)
      .post('/api/mentor/chat')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ message: 'TRIGGER_GEMINI_ERROR' });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Gemini API internal service connection failure');
  });

  // 14. Gemini 429 Quota Error Handling
  it('14. should handle Gemini HTTP 429 rate-limit quota error gracefully', async () => {
    const res = await request(app)
      .post('/api/mentor/chat')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ message: 'TRIGGER_429_QUOTA' });

    expect(res.status).toBe(429);
    expect(res.body.error).toContain('free AI quota has been reached');
  });

  // 4. Delete Conversation
  it('4. should delete a conversation owned by User A', async () => {
    const res = await request(app)
      .delete(`/api/mentor/conversations/${testConversationId}`)
      .set('Authorization', `Bearer ${tokenA}`);

    expect(res.status).toBe(200);
    expect(res.body.conversationId).toBe(testConversationId);

    // Confirm deletion
    const checkRes = await request(app)
      .get(`/api/mentor/conversations/${testConversationId}`)
      .set('Authorization', `Bearer ${tokenA}`);

    expect(checkRes.status).toBe(404);
  });
});
