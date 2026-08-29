import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Seed Default User Accounts
  const defaultAccounts = [
    {
      email: 'raghuluma2006@gmail.com',
      username: 'Raghul',
      password: 'Raghul@2006',
      name: 'Raghul (Administrator)',
      role: 'Administrator',
      department: 'System Architecture & Operations',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      status: 'Active'
    },
    {
      email: 'manager@smartoil.com',
      username: 'Manager',
      password: 'Manager@2006',
      name: 'Ananya Sharma (Manager)',
      role: 'Factory Manager',
      department: 'Plant Operations Management',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
      status: 'Active'
    },
    {
      email: 'staff@smartoil.com',
      username: 'Rajesh',
      password: 'Staff@2006',
      name: 'Rajesh Kumar (Staff)',
      role: 'Factory Staff',
      department: 'Refining & Pressing',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      status: 'Active'
    }
  ];

  for (const acc of defaultAccounts) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(acc.password, salt);

    await prisma.user.upsert({
      where: { email: acc.email },
      update: {
        name: acc.name,
        role: acc.role,
        department: acc.department,
        avatar: acc.avatar,
        status: acc.status
      },
      create: {
        email: acc.email,
        username: acc.username,
        passwordHash,
        name: acc.name,
        role: acc.role,
        department: acc.department,
        avatar: acc.avatar,
        status: acc.status
      }
    });
  }
  console.log('✅ Users seeded');

  // 2. Seed 5 Core Inventory Items
  const inventoryData = [
    { name: 'Groundnut Oil', currentLiters: 5000, capacityLiters: 10000, minAlert: 1000 },
    { name: 'Sunflower Oil', currentLiters: 3500, capacityLiters: 8000, minAlert: 800 },
    { name: 'Mustard Oil', currentLiters: 450, capacityLiters: 6000, minAlert: 500 },
    { name: 'Sesame Oil', currentLiters: 1800, capacityLiters: 5000, minAlert: 400 },
    { name: 'Coconut Oil', currentLiters: 4000, capacityLiters: 7000, minAlert: 1000 }
  ];

  for (const item of inventoryData) {
    await prisma.inventoryItem.upsert({
      where: { name: item.name },
      update: {},
      create: item
    });
  }
  console.log('✅ Inventory tanks seeded');

  // 3. Seed Production Logs
  const productionData = [
    { id: 'BATCH-101', oilType: 'Groundnut Oil', quantityLiters: 1200, details: 'Regular Morning Batch', date: '2026-08-10' },
    { id: 'BATCH-102', oilType: 'Coconut Oil', quantityLiters: 800, details: 'Pure Cold Pressed Batch', date: '2026-08-10' }
  ];

  for (const prod of productionData) {
    const exists = await prisma.productionBatch.findUnique({ where: { id: prod.id } });
    if (!exists) {
      await prisma.productionBatch.create({ data: prod });
    }
  }
  console.log('✅ Production logs seeded');

  // 4. Seed Supplier Logs
  const supplierData = [
    { id: 'SUP-01', supplierName: 'AgriCorp Farmers', materialItem: 'Raw Groundnuts', quantity: '5 Tons', totalCost: 425000, date: '2026-08-09' },
    { id: 'SUP-02', supplierName: 'Sunshine Seeds Co.', materialItem: 'Sunflower Seeds', quantity: '3 Tons', totalCost: 280000, date: '2026-08-10' }
  ];

  for (const sup of supplierData) {
    const exists = await prisma.supplierIntake.findUnique({ where: { id: sup.id } });
    if (!exists) {
      await prisma.supplierIntake.create({ data: sup });
    }
  }
  console.log('✅ Supplier logs seeded');

  // 5. Seed Sales Orders
  const salesData = [
    { id: 'ORD-501', orderType: 'Retail Customer', buyerName: 'FreshMart Store', oilType: 'Groundnut Oil', quantityLiters: 500, totalAmount: 95000, date: '2026-08-10' },
    { id: 'ORD-502', orderType: 'Wholesale Supplier', buyerName: 'Golden Oils Wholesale', oilType: 'Sunflower Oil', quantityLiters: 1000, totalAmount: 180000, date: '2026-08-10' }
  ];

  for (const sale of salesData) {
    const exists = await prisma.salesOrder.findUnique({ where: { id: sale.id } });
    if (!exists) {
      await prisma.salesOrder.create({ data: sale });
    }
  }
  console.log('✅ Sales orders seeded');

  console.log('🎉 Database seed complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
