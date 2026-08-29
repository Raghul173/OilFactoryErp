import { prisma } from '../config/db.js';

// GET /api/inventory
export const getInventory = async (req, res) => {
  try {
    const inventory = await prisma.inventoryItem.findMany({
      orderBy: { id: 'asc' }
    });

    const lowStockAlerts = inventory.filter(item => item.currentLiters <= item.minAlert);

    res.json({
      success: true,
      inventory,
      lowStockAlerts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch inventory', error: error.message });
  }
};

// PUT /api/inventory/:id
export const updateInventoryItem = async (req, res) => {
  const { id } = req.params;
  const { capacityLiters, minAlert, currentLiters } = req.body;

  try {
    const updated = await prisma.inventoryItem.update({
      where: { id: Number(id) },
      data: {
        ...(capacityLiters !== undefined && { capacityLiters: Number(capacityLiters) }),
        ...(minAlert !== undefined && { minAlert: Number(minAlert) }),
        ...(currentLiters !== undefined && { currentLiters: Number(currentLiters) })
      }
    });

    // Broadcast live update over Socket.io
    const io = req.app.get('io');
    if (io) {
      io.emit('inventory:updated', { item: updated });
    }

    res.json({ success: true, item: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update inventory tank', error: error.message });
  }
};
