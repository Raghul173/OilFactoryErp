import { prisma } from '../config/db.js';

// GET /api/production
export const getProductionLogs = async (req, res) => {
  try {
    const logs = await prisma.productionBatch.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        recordedBy: {
          select: { name: true, email: true, role: true }
        }
      }
    });

    res.json({ success: true, logs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch production logs', error: error.message });
  }
};

// POST /api/production
export const addProductionBatch = async (req, res) => {
  const { oilType, quantityLiters, details } = req.body;

  if (!oilType || !quantityLiters || Number(quantityLiters) <= 0) {
    return res.status(400).json({ success: false, message: 'Valid oil type and positive quantity in liters are required.' });
  }

  const qty = Number(quantityLiters);
  const batchId = `BATCH-${Math.floor(100 + Math.random() * 900)}`;
  const dateStr = new Date().toISOString().split('T')[0];

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create Production Batch record
      const newBatch = await tx.productionBatch.create({
        data: {
          id: batchId,
          oilType,
          quantityLiters: qty,
          details: details || 'Standard Extraction Batch',
          date: dateStr,
          userId: req.user?.id || null
        }
      });

      // 2. Fetch and atomically increase inventory
      const tank = await tx.inventoryItem.findUnique({
        where: { name: oilType }
      });

      let updatedTank = null;
      if (tank) {
        const newLiters = Math.min(tank.capacityLiters, tank.currentLiters + qty);
        updatedTank = await tx.inventoryItem.update({
          where: { name: oilType },
          data: { currentLiters: newLiters }
        });
      }

      return { newBatch, updatedTank };
    });

    // 3. Broadcast real-time event via Socket.io
    const io = req.app.get('io');
    if (io) {
      const allInventory = await prisma.inventoryItem.findMany({ orderBy: { id: 'asc' } });
      io.emit('production:added', { batch: result.newBatch });
      io.emit('inventory:sync', { inventory: allInventory });
    }

    res.status(201).json({
      success: true,
      batch: result.newBatch,
      updatedTank: result.updatedTank
    });
  } catch (error) {
    console.error('Production batch error:', error);
    res.status(500).json({ success: false, message: 'Failed to record production batch', error: error.message });
  }
};
