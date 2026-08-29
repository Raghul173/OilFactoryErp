import express from 'express';
import { getInventory, updateInventoryItem } from '../controllers/inventoryController.js';
import { authenticateToken, requireRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getInventory);
router.put('/:id', authenticateToken, requireRole(['Administrator', 'Factory Manager']), updateInventoryItem);

export default router;
