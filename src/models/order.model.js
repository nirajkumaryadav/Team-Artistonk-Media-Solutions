const { connectDatabase } = require('../config/db');
const { toObjectId, serialize } = require('../utils/mongo');

async function create({ userId, totalAmount, status = 'placed' }, options = {}) {
  const db = await connectDatabase();
  const document = { userId: toObjectId(userId), totalAmount, status, createdAt: new Date() };
  const result = await db.collection('orders').insertOne(document, options);
  return { ...serialize({ ...document, _id: result.insertedId }), userId };
}

async function createItem({ orderId, productId, quantity, priceAtPurchase }, options = {}) {
  const db = await connectDatabase();
  const document = { orderId: toObjectId(orderId), productId: toObjectId(productId), quantity, priceAtPurchase };
  const result = await db.collection('orderItems').insertOne(document, options);
  return { ...serialize({ ...document, _id: result.insertedId }), orderId, productId };
}

async function addItems(orders, options = {}) {
  const db = await connectDatabase();
  return Promise.all(orders.map(async (order) => {
    const items = await db.collection('orderItems').find({ orderId: order._id }, options).toArray();
    const serializedItems = await Promise.all(items.map(async (item) => {
      const product = await db.collection('products').findOne({ _id: item.productId }, options);
      return { ...serialize(item), orderId: order.id, productId: item.productId.toString(), productName: product?.name || null };
    }));
    return { ...serialize(order), userId: order.userId.toString(), items: serializedItems };
  }));
}

async function findAllByUserId(userId, options = {}) {
  const userObjectId = toObjectId(userId);
  if (!userObjectId) return [];
  const db = await connectDatabase();
  const orders = await db.collection('orders').find({ userId: userObjectId }, options).sort({ createdAt: -1 }).toArray();
  return addItems(orders, options);
}

async function findByIdAndUserId(id, userId, options = {}) {
  const objectId = toObjectId(id);
  const userObjectId = toObjectId(userId);
  if (!objectId || !userObjectId) return null;
  const db = await connectDatabase();
  const order = await db.collection('orders').findOne({ _id: objectId, userId: userObjectId }, options);
  return (await addItems(order ? [order] : [], options))[0] || null;
}

async function findById(id, options = {}) {
  const objectId = toObjectId(id);
  if (!objectId) return null;
  const db = await connectDatabase();
  const order = await db.collection('orders').findOne({ _id: objectId }, options);
  return order ? { ...serialize(order), userId: order.userId.toString() } : null;
}

module.exports = { create, createItem, findAllByUserId, findByIdAndUserId, findById };
