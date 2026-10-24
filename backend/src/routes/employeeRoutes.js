import express from 'express';
import {
  getEmployees,
  addEmployee,
  removeEmployee,
  updateAttendance,
} from '../controllers/employeeController.js';

const router = express.Router();

router.get('/', getEmployees);
router.post('/', addEmployee);
router.delete('/:id', removeEmployee);
router.patch('/:id/attendance', updateAttendance);

export default router;
