import Employee from '../models/Employee.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().select('-password').sort({ createdAt: 1 });
    res.json({
      success: true,
      employees,
    });
  } catch (err) {
    console.error('Get employees error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch employee roster', error: err.message });
  }
};

export const addEmployee = async (req, res) => {
  try {
    const { name, role, email, dept, shift, allocatedMachine, username, password } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Employee name and email are required' });
    }

    // Strictly permit only Factory Staff or Factory Manager to be added
    const allowedRoles = ['Factory Staff', 'Factory Manager'];
    const assignedRole = allowedRoles.includes(role) ? role : 'Factory Staff';

    const timestampSuffix = Date.now().toString().slice(-4);
    const empId = `EMP-${timestampSuffix}`;
    const cleanUsername = username?.trim() || email.split('@')[0];
    const pass = password || 'Default@123';

    const newEmp = await Employee.create({
      id: empId,
      name: name.trim(),
      role: assignedRole,
      email: email.toLowerCase().trim(),
      dept: dept || '',
      shift: shift || '',
      allocatedMachine: allocatedMachine || '',
      username: cleanUsername,
    });

    // Also sync login account into User model if not already present
    try {
      const existingUser = await User.findOne({
        $or: [{ email: email.toLowerCase().trim() }, { username: cleanUsername }]
      });

      if (!existingUser) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(pass, salt);
        await User.create({
          name: name.trim(),
          email: email.toLowerCase().trim(),
          username: cleanUsername,
          password: hashedPassword,
          role: assignedRole,
          department: dept || 'Operations',
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${email}`,
          status: 'Active',
        });
      }
    } catch (userSyncErr) {
      console.warn('User login credentials sync notice:', userSyncErr.message);
    }

    const io = req.app.get('io');
    if (io) {
      io.emit('employee:added', { employee: newEmp });
    }

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      employee: newEmp,
    });
  } catch (err) {
    console.error('Add employee error:', err);
    res.status(500).json({ success: false, message: 'Failed to add employee', error: err.message });
  }
};

export const removeEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const removed = await Employee.findOneAndDelete({
      $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }]
    });

    if (!removed) {
      return res.status(404).json({ success: false, message: `Member with id ${id} not found` });
    }

    // Also remove from User collection to revoke login account
    if (removed.email) {
      await User.findOneAndDelete({ email: removed.email.toLowerCase().trim() }).catch(() => {});
    }

    const io = req.app.get('io');
    if (io) {
      io.emit('employee:removed', { id: removed.id || id });
    }

    res.json({
      success: true,
      message: 'Member account removed successfully',
      id: removed.id || id,
    });
  } catch (err) {
    console.error('Remove employee error:', err);
    res.status(500).json({ success: false, message: 'Failed to remove member account', error: err.message });
  }
};

export const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { attendance } = req.body;

    const updated = await Employee.findOneAndUpdate(
      { $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
      { attendance },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: `Employee ${id} not found` });
    }

    const io = req.app.get('io');
    if (io) {
      io.emit('employee:updated', { employee: updated });
    }

    res.json({
      success: true,
      message: 'Attendance updated successfully',
      employee: updated,
    });
  } catch (err) {
    console.error('Update attendance error:', err);
    res.status(500).json({ success: false, message: 'Failed to update attendance', error: err.message });
  }
};

export default { getEmployees, addEmployee, removeEmployee, updateAttendance };
