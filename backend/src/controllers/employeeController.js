import bcrypt from 'bcryptjs';
import { prisma } from '../config/db.js';

// GET /api/employees
export const getEmployees = async (req, res) => {
  try {
    const employees = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        role: true,
        email: true,
        department: true,
        avatar: true,
        status: true,
        createdAt: true
      },
      orderBy: { createdAt: 'asc' }
    });

    // Map to the shape expected by frontend
    const mapped = employees.map((emp, index) => ({
      id: `EMP-0${index + 1}`,
      rawId: emp.id,
      name: emp.name,
      role: emp.role,
      email: emp.email,
      dept: emp.department || 'Operations',
      avatar: emp.avatar,
      status: emp.status
    }));

    res.json({ success: true, employees: mapped });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch employees', error: error.message });
  }
};

// POST /api/employees
export const addEmployee = async (req, res) => {
  const { name, role, email, dept, password } = req.body;

  if (!name || !email) {
    return res.status(400).json({ success: false, message: 'Name and email are required.' });
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'User with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password || 'Staff@2006', salt);

    const user = await prisma.user.create({
      data: {
        email,
        username: email.split('@')[0],
        name,
        role: role || 'Factory Staff',
        department: dept || 'Production',
        passwordHash,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${email}`,
        status: 'Active'
      }
    });

    const count = await prisma.user.count();
    const newEmp = {
      id: `EMP-0${count}`,
      rawId: user.id,
      name: user.name,
      role: user.role,
      email: user.email,
      dept: user.department,
      avatar: user.avatar,
      status: user.status
    };

    const io = req.app.get('io');
    if (io) {
      io.emit('employee:added', { employee: newEmp });
    }

    res.status(201).json({ success: true, employee: newEmp });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add employee', error: error.message });
  }
};

// DELETE /api/employees/:id
export const removeEmployee = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if ID is custom "EMP-0X" or UUID
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { id },
          { email: id }
        ]
      }
    });

    if (user) {
      await prisma.user.delete({ where: { id: user.id } });
    }

    const io = req.app.get('io');
    if (io) {
      io.emit('employee:removed', { id });
    }

    res.json({ success: true, message: 'Employee removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to remove employee', error: error.message });
  }
};
