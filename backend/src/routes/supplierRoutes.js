import express from 'express';
import { getSupplierLogs, addSupplierIntake } from '../controllers/supplierController.js';
import { authenticateToken, requireRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getSupplierLogs);
router.post('/', authenticateToken, requireRole(['Administrator', 'Factory Manager']), addSupplierIntake);

export default router;
