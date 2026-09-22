const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'inventory_order_api';
const client = uri ? new MongoClient(uri) : null;
let database;

async function connectDatabase() {
  if (!client) throw new Error('MONGODB_URI is missing. Copy .env.example to .env and configure MongoDB.');
  if (!database) {
    await client.connect();
    database = client.db(dbName);
  }
  return database;
}

async function closeDatabase() {
  if (client) await client.close();
  database = null;
}

module.exports = { client, connectDatabase, closeDatabase };
