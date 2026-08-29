import express from 'express';
import { getProductionLogs, addProductionBatch } from '../controllers/productionController.js';
import { authenticateToken, requireRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getProductionLogs);
router.post('/', authenticateToken, requireRole(['Administrator', 'Factory Manager', 'Factory Staff']), addProductionBatch);

export default router;
