const { connectDatabase } = require('../config/db');
const { toObjectId, serialize } = require('../utils/mongo');

async function create({ name, description, price, stockQuantity, category }, options = {}) {
  const db = await connectDatabase();
  const document = { name, description: description || null, price, stockQuantity, category: category || null, createdAt: new Date() };
  const result = await db.collection('products').insertOne(document, options);
  return serialize({ ...document, _id: result.insertedId });
}

async function findAll(filters = {}, options = {}) {
  const query = {};
  if (filters.search) query.name = { $regex: filters.search, $options: 'i' };
  if (filters.category) query.category = filters.category;
  if (filters.inStock !== undefined) query.stockQuantity = filters.inStock ? { $gt: 0 } : 0;
  const db = await connectDatabase();
  const documents = await db.collection('products')
    .find(query, options)
    .sort({ createdAt: -1 })
    .skip(filters.offset)
    .limit(filters.limit)
    .toArray();
  return documents.map(serialize);
}

async function findById(id, options = {}) {
  const objectId = toObjectId(id);
  if (!objectId) return null;
  const db = await connectDatabase();
  return serialize(await db.collection('products').findOne({ _id: objectId }, options));
}

async function update(id, values, options = {}) {
  const objectId = toObjectId(id);
  if (!objectId) return null;
  const db = await connectDatabase();
  await db.collection('products').updateOne({ _id: objectId }, { $set: values }, options);
  return findById(id, options);
}

async function remove(id, options = {}) {
  const objectId = toObjectId(id);
  if (!objectId) return null;
  const db = await connectDatabase();
  const result = await db.collection('products').findOneAndDelete({ _id: objectId }, options);
  return result ? serialize(result.value || result) : null;
}

async function updateStock(id, quantity, options = {}) {
  const objectId = toObjectId(id);
  if (!objectId) return null;
  const db = await connectDatabase();
  const result = await db.collection('products').findOneAndUpdate(
    { _id: objectId, stockQuantity: { $gte: quantity } },
    { $inc: { stockQuantity: -quantity } },
    { ...options, returnDocument: 'after' },
  );
  return result ? serialize(result.value || result) : null;
}

module.exports = { create, findAll, findById, update, remove, updateStock };
