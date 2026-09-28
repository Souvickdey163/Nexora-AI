import { Router } from 'express';
import { supportController } from '../controllers/support.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Authenticated user support ticket endpoints
router.post('/tickets', authenticateToken, supportController.createTicket.bind(supportController));
router.get('/tickets', authenticateToken, supportController.getUserTickets.bind(supportController));
router.get('/tickets/:id', authenticateToken, supportController.getTicketById.bind(supportController));

// Admin / Support Role endpoints
router.get('/admin/tickets', authenticateToken, supportController.getAllTicketsAdmin.bind(supportController));
router.patch('/admin/tickets/:id', authenticateToken, supportController.updateTicketStatusAdmin.bind(supportController));

export default router;
