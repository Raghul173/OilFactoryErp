import { prisma } from '../config/db.js';

// GET /api/sales
export const getSalesLogs = async (req, res) => {
  try {
    const logs = await prisma.salesOrder.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        recordedBy: {
          select: { name: true, email: true, role: true }
        }
      }
    });

    res.json({ success: true, logs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch sales orders', error: error.message });
  }
};

// POST /api/sales
export const addSalesOrder = async (req, res) => {
  const { orderType, buyerName, oilType, quantityLiters, totalAmount } = req.body;

  if (!orderType || !buyerName || !oilType || !quantityLiters || !totalAmount) {
    return res.status(400).json({ success: false, message: 'All order fields (orderType, buyerName, oilType, quantity, totalAmount) are required.' });
  }

  const qty = Number(quantityLiters);
  const amount = Number(totalAmount);
  const orderId = `ORD-${Math.floor(500 + Math.random() * 500)}`;
  const dateStr = new Date().toISOString().split('T')[0];

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Check stock level
      const tank = await tx.inventoryItem.findUnique({
        where: { name: oilType }
      });

      if (!tank) {
        throw new Error(`Oil type "${oilType}" not found in inventory.`);
      }

      if (tank.currentLiters < qty) {
        throw new Error(`Insufficient stock for ${oilType}. Available: ${tank.currentLiters} Liters, Requested: ${qty} Liters.`);
      }

      // 2. Deduct inventory
      const updatedTank = await tx.inventoryItem.update({
        where: { name: oilType },
        data: {
          currentLiters: {
            decrement: qty
          }
        }
      });

      // 3. Create Sales Order
      const newSale = await tx.salesOrder.create({
        data: {
          id: orderId,
          orderType,
          buyerName,
          oilType,
          quantityLiters: qty,
          totalAmount: amount,
          date: dateStr,
          userId: req.user?.id || null
        }
      });

      return { newSale, updatedTank };
    });

    // 4. Broadcast live update over Socket.io
    const io = req.app.get('io');
    if (io) {
      const allInventory = await prisma.inventoryItem.findMany({ orderBy: { id: 'asc' } });
      io.emit('sales:added', { sale: result.newSale });
      io.emit('inventory:sync', { inventory: allInventory });
    }

    res.status(201).json({
      success: true,
      sale: result.newSale,
      updatedTank: result.updatedTank
    });
  } catch (error) {
    console.error('Sales order error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};
