import { prisma } from '../config/db.js';

// GET /api/suppliers
export const getSupplierLogs = async (req, res) => {
  try {
    const logs = await prisma.supplierIntake.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, logs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch supplier logs', error: error.message });
  }
};

// POST /api/suppliers
export const addSupplierIntake = async (req, res) => {
  const { supplierName, materialItem, quantity, totalCost } = req.body;

  if (!supplierName || !materialItem || !quantity || !totalCost) {
    return res.status(400).json({ success: false, message: 'All supplier intake fields are required.' });
  }

  try {
    const count = await prisma.supplierIntake.count();
    const supId = `SUP-0${count + 1}`;
    const dateStr = new Date().toISOString().split('T')[0];

    const newSupplier = await prisma.supplierIntake.create({
      data: {
        id: supId,
        supplierName,
        materialItem,
        quantity,
        totalCost: Number(totalCost),
        date: dateStr
      }
    });

    const io = req.app.get('io');
    if (io) {
      io.emit('supplier:added', { intake: newSupplier });
    }

    res.status(201).json({ success: true, intake: newSupplier });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to record supplier intake', error: error.message });
  }
};
