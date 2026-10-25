import express from 'express';
import {
  getEmployees,
  addEmployee,
  removeEmployee,
  updateAttendance,
} from '../controllers/employeeController.js';
import { authenticateToken, requireRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getEmployees);
router.post('/', authenticateToken, requireRole(['Administrator', 'Factory Manager']), addEmployee);
router.delete('/:id', authenticateToken, requireRole(['Administrator', 'Factory Manager']), removeEmployee);
router.patch('/:id/attendance', authenticateToken, updateAttendance);

export default router;

