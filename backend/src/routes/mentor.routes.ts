import { Router } from 'express';
import { mentorController } from '../controllers/mentor.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// All mentor routes require valid JWT authentication
router.use(authenticateToken);

// Conversation management endpoints
router.post('/conversations', (req, res) => mentorController.createConversation(req, res));
router.get('/conversations', (req, res) => mentorController.listConversations(req, res));
router.get('/conversations/:id', (req, res) => mentorController.getConversation(req, res));
router.delete('/conversations/:id', (req, res) => mentorController.deleteConversation(req, res));

// Conversation messages endpoints
router.get('/conversations/:id/messages', (req, res) => mentorController.getMessages(req, res));
router.post('/conversations/:id/messages', (req, res) => mentorController.sendMessage(req, res));

// Direct chat endpoint
router.post('/chat', (req, res) => mentorController.sendMessage(req, res));

export default router;
