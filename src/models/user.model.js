const { connectDatabase } = require('../config/db');
const { toObjectId, serialize } = require('../utils/mongo');

async function create({ name, email, passwordHash }, options = {}) {
  const db = await connectDatabase();
  const document = { name, email, passwordHash, createdAt: new Date() };
  const result = await db.collection('users').insertOne(document, options);
  const user = serialize({ ...document, _id: result.insertedId });
  delete user.passwordHash;
  return user;
}

async function findByEmail(email, options = {}) {
  const db = await connectDatabase();
  return serialize(await db.collection('users').findOne({ email }, options));
}

async function findById(id, options = {}) {
  const objectId = toObjectId(id);
  if (!objectId) return null;
  const db = await connectDatabase();
  return serialize(await db.collection('users').findOne({ _id: objectId }, options));
}

module.exports = { create, findByEmail, findById };
