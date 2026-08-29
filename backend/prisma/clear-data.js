import mysql from 'mysql2/promise';

async function clearDummyData() {
  console.log('🧹 Connecting to TiDB Cloud MySQL to clear dummy data...');

  const connection = await mysql.createConnection({
    host: 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
    port: 4000,
    user: '2MEigbXd48Zouyp.root',
    password: 'oIBKe3pxBleWzdVi',
    database: 'test',
    ssl: {
      minVersion: 'TLSv1.2',
      rejectUnauthorized: true
    }
  });

  console.log('Connected! Clearing production logs, sales orders, supplier logs, and resetting tanks...');

  // 1. Delete all Production Batches
  await connection.execute('DELETE FROM ProductionBatch');
  console.log('✅ Cleared ProductionBatch');

  // 2. Delete all Sales Orders
  await connection.execute('DELETE FROM SalesOrder');
  console.log('✅ Cleared SalesOrder');

  // 3. Delete all Supplier Intakes
  await connection.execute('DELETE FROM SupplierIntake');
  console.log('✅ Cleared SupplierIntake');

  // 4. Delete all Audit Logs
  await connection.execute('DELETE FROM AuditLog');
  console.log('✅ Cleared AuditLog');

  // 5. Reset all Inventory Tanks to 0 Liters
  await connection.execute('UPDATE InventoryItem SET currentLiters = 0');
  console.log('✅ Reset all Inventory Tanks to 0 Liters');

  // 6. Keep only the Administrator account in User table
  await connection.execute(`DELETE FROM User WHERE email NOT IN ('raghuluma2006@gmail.com')`);
  console.log('✅ Cleaned up dummy user accounts (kept Administrator: raghuluma2006@gmail.com)');

  console.log('🎉 Database is completely clean and ready for your real data!');
  await connection.end();
}

clearDummyData().catch(err => {
  console.error('Error clearing data:', err);
  process.exit(1);
});
