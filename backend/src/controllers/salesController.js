import Sales from '../models/Sales.js';
import Inventory from '../models/Inventory.js';

export const getLogs = async (req, res) => {
  try {
    const logs = await Sales.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      logs,
    });
  } catch (err) {
    console.error('Get sales logs error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch sales logs', error: err.message });
  }
};

export const addSale = async (req, res) => {
  try {
    const { orderType, buyerName, oilType, quantityLiters, totalAmount } = req.body;

    if (!buyerName || !oilType || !quantityLiters || totalAmount === undefined) {
      return res.status(400).json({ success: false, message: 'All sale order fields are required' });
    }

    const qty = Number(quantityLiters);
    const amt = Number(totalAmount);
    if (qty <= 0) {
      return res.status(400).json({ success: false, message: 'Quantity must be greater than zero' });
    }

    const orderId = `ORD-${Math.floor(500 + Math.random() * 500)}`;
    const newSale = await Sales.create({
      id: orderId,
      orderType: orderType || 'Retail Customer',
      buyerName,
      oilType,
      quantityLiters: qty,
      totalAmount: amt,
      date: new Date().toISOString().split('T')[0],
    });

    // Automatically deduct inventory stock for this oil variety
    const tank = await Inventory.findOne({ name: oilType });
    let updatedTank = null;
    if (tank) {
      tank.currentLiters = Math.max(0, tank.currentLiters - qty);
      updatedTank = await tank.save();
    }

    // Broadcast real-time Socket.io events
    const io = req.app.get('io');
    if (io) {
      io.emit('sales:added', { sale: newSale });
      if (updatedTank) {
        io.emit('inventory:updated', { item: updatedTank });
      }
    }

    res.status(201).json({
      success: true,
      message: `Sale recorded. Deducted ${qty}L from ${oilType}.`,
      sale: newSale,
      updatedInventory: updatedTank,
    });
  } catch (err) {
    console.error('Add sale error:', err);
    res.status(500).json({ success: false, message: 'Failed to record sale', error: err.message });
  }
};

export default { getLogs, addSale };
