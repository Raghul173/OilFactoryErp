import { prisma } from '../config/db.js';

// GET /api/analytics/summary
export const getDashboardSummary = async (req, res) => {
  try {
    const inventory = await prisma.inventoryItem.findMany();
    const productionLogs = await prisma.productionBatch.findMany();
    const salesLogs = await prisma.salesOrder.findMany();
    const supplierLogs = await prisma.supplierIntake.findMany();

    const totalStockLiters = inventory.reduce((sum, item) => sum + item.currentLiters, 0);
    const totalCapacityLiters = inventory.reduce((sum, item) => sum + item.capacityLiters, 0);
    const totalSalesRevenue = salesLogs.reduce((sum, item) => sum + item.totalAmount, 0);
    const totalProductionLiters = productionLogs.reduce((sum, item) => sum + item.quantityLiters, 0);
    const totalProcurementCost = supplierLogs.reduce((sum, item) => sum + item.totalCost, 0);

    const lowStockAlerts = inventory.filter(item => item.currentLiters <= item.minAlert);

    res.json({
      success: true,
      summary: {
        totalStockLiters,
        totalCapacityLiters,
        stockUtilizationPercent: Math.round((totalStockLiters / totalCapacityLiters) * 100) || 0,
        totalSalesRevenue,
        totalProductionLiters,
        totalProcurementCost,
        lowStockCount: lowStockAlerts.length,
        lowStockAlerts
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to generate analytics summary', error: error.message });
  }
};
