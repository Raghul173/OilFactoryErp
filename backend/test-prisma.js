import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function main() {
  console.log('Testing Prisma query to TiDB Cloud...');
  try {
    const items = await prisma.inventoryItem.findMany();
    console.log('✅ Prisma successfully fetched inventory items:', items);
  } catch (e) {
    console.error('❌ Prisma query error:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
