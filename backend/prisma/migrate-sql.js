import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

async function migrateAndSeed() {
  console.log('🚀 Connecting to TiDB Cloud MySQL to create tables...');

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

  console.log('Connected! Creating tables with matching collations...');

  // Set default charset
  await connection.query('SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci');

  // 1. User table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS User (
      id VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL PRIMARY KEY,
      email VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL UNIQUE,
      username VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL UNIQUE,
      passwordHash VARCHAR(255) NULL,
      name VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
      role VARCHAR(191) NOT NULL DEFAULT 'Factory Staff',
      department VARCHAR(191) NOT NULL DEFAULT 'General Operations',
      avatar TEXT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'Active',
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // 2. InventoryItem table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS InventoryItem (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL UNIQUE,
      currentLiters DOUBLE NOT NULL DEFAULT 0,
      capacityLiters DOUBLE NOT NULL,
      minAlert DOUBLE NOT NULL,
      updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // 3. ProductionBatch table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS ProductionBatch (
      id VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL PRIMARY KEY,
      oilType VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
      quantityLiters DOUBLE NOT NULL,
      details VARCHAR(255) NOT NULL DEFAULT 'Standard Extraction Batch',
      date VARCHAR(50) NOT NULL,
      userId VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      INDEX idx_userId (userId)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // 4. SalesOrder table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS SalesOrder (
      id VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL PRIMARY KEY,
      orderType VARCHAR(191) NOT NULL,
      buyerName VARCHAR(191) NOT NULL,
      oilType VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
      quantityLiters DOUBLE NOT NULL,
      totalAmount DOUBLE NOT NULL,
      date VARCHAR(50) NOT NULL,
      userId VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      INDEX idx_sales_user (userId)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // 5. SupplierIntake table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS SupplierIntake (
      id VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL PRIMARY KEY,
      supplierName VARCHAR(191) NOT NULL,
      materialItem VARCHAR(191) NOT NULL,
      quantity VARCHAR(191) NOT NULL,
      totalCost DOUBLE NOT NULL,
      date VARCHAR(50) NOT NULL,
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // 6. AuditLog table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS AuditLog (
      id VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL PRIMARY KEY,
      action VARCHAR(191) NOT NULL,
      details TEXT NULL,
      userEmail VARCHAR(191) NULL,
      timestamp DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // Seed Default Users
  console.log('🌱 Seeding initial factory accounts and tanks...');
  const salt = await bcrypt.genSalt(10);
  const adminHash = await bcrypt.hash('Raghul@2006', salt);
  const managerHash = await bcrypt.hash('Manager@2006', salt);
  const staffHash = await bcrypt.hash('Staff@2006', salt);
  const now = new Date();

  const defaultUsers = [
    ['usr-admin-01', 'raghuluma2006@gmail.com', 'Raghul', adminHash, 'Raghul (Administrator)', 'Administrator', 'System Architecture & Operations', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', 'Active', now, now],
    ['usr-mgr-02', 'manager@smartoil.com', 'Manager', managerHash, 'Ananya Sharma (Manager)', 'Factory Manager', 'Plant Operations Management', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80', 'Active', now, now],
    ['usr-stf-03', 'staff@smartoil.com', 'Rajesh', staffHash, 'Rajesh Kumar (Staff)', 'Factory Staff', 'Refining & Pressing', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', 'Active', now, now]
  ];

  for (const u of defaultUsers) {
    await connection.execute(`
      INSERT INTO User (id, email, username, passwordHash, name, role, department, avatar, status, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE name = VALUES(name), role = VALUES(role), department = VALUES(department), updatedAt = NOW()
    `, u);
  }

  // Seed 5 Core Inventory Items
  const inventoryItems = [
    [1, 'Groundnut Oil', 5000, 10000, 1000, now],
    [2, 'Sunflower Oil', 3500, 8000, 800, now],
    [3, 'Mustard Oil', 450, 6000, 500, now],
    [4, 'Sesame Oil', 1800, 5000, 400, now],
    [5, 'Coconut Oil', 4000, 7000, 1000, now]
  ];

  for (const item of inventoryItems) {
    await connection.execute(`
      INSERT INTO InventoryItem (id, name, currentLiters, capacityLiters, minAlert, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE currentLiters = VALUES(currentLiters), capacityLiters = VALUES(capacityLiters), minAlert = VALUES(minAlert), updatedAt = NOW()
    `, item);
  }

  // Seed Production Batches
  await connection.execute(`
    INSERT IGNORE INTO ProductionBatch (id, oilType, quantityLiters, details, date)
    VALUES 
      ('BATCH-101', 'Groundnut Oil', 1200, 'Regular Morning Batch', '2026-08-10'),
      ('BATCH-102', 'Coconut Oil', 800, 'Pure Cold Pressed Batch', '2026-08-10')
  `);

  // Seed Supplier Intakes
  await connection.execute(`
    INSERT IGNORE INTO SupplierIntake (id, supplierName, materialItem, quantity, totalCost, date)
    VALUES 
      ('SUP-01', 'AgriCorp Farmers', 'Raw Groundnuts', '5 Tons', 425000, '2026-08-09'),
      ('SUP-02', 'Sunshine Seeds Co.', 'Sunflower Seeds', '3 Tons', 280000, '2026-08-10')
  `);

  // Seed Sales Orders
  await connection.execute(`
    INSERT IGNORE INTO SalesOrder (id, orderType, buyerName, oilType, quantityLiters, totalAmount, date)
    VALUES 
      ('ORD-501', 'Retail Customer', 'FreshMart Store', 'Groundnut Oil', 500, 95000, '2026-08-10'),
      ('ORD-502', 'Wholesale Supplier', 'Golden Oils Wholesale', 'Sunflower Oil', 1000, 180000, '2026-08-10')
  `);

  console.log('🎉 Cloud MySQL Database schema & seed successfully deployed to TiDB Cloud!');
  await connection.end();
}

migrateAndSeed().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
