import express from 'express';
import { getSalesLogs, addSalesOrder } from '../controllers/salesController.js';
import { authenticateToken, requireRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getSalesLogs);
router.post('/', authenticateToken, requireRole(['Administrator', 'Factory Manager', 'Factory Staff']), addSalesOrder);

export default router;
