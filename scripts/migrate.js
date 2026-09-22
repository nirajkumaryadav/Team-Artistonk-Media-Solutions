require('dotenv').config();
dns.setServers(['8.8.8.8', '8.8.4.4']);
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
console.log('Active DNS Servers:', dns.getServers());
const { connectDatabase, closeDatabase } = require('../src/config/db');

async function migrate() {
  try {
    const db = await connectDatabase();
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('products').createIndex({ name: 'text', category: 1 });
    await db.collection('orders').createIndex({ userId: 1, createdAt: -1 });
    await db.collection('orderItems').createIndex({ orderId: 1 });
    console.log('MongoDB indexes created. Migration completed.');
  } finally {
    await closeDatabase();
  }
}

migrate().catch((error) => {
  console.error('Migration failed:', error.message);
  process.exitCode = 1;
});
