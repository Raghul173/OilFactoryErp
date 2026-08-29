import mysql from 'mysql2/promise';

async function testConnection() {
  console.log('Testing MySQL connection to TiDB Cloud...');
  try {
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

    console.log('✅ Successfully connected to TiDB Cloud MySQL!');
    const [rows] = await connection.execute('SELECT 1 + 1 AS solution, VERSION() AS version');
    console.log('Query result:', rows);
    await connection.end();
  } catch (error) {
    console.error('❌ Connection error:', error.message);
  }
}

testConnection();
