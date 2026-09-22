const { client, connectDatabase } = require('../config/db');
const Product = require('../models/product.model');
const Order = require('../models/order.model');
const ApiError = require('../utils/ApiError');

async function createOrder(userId, items) {
  await connectDatabase();
  const session = client.startSession();
  try {
    let createdOrder;
    await session.withTransaction(async () => {
      const options = { session };
      const pricedItems = [];

      for (const item of items) {
        // The conditional update locks and checks the document atomically. Concurrent
        // buyers cannot both decrement the same last unit, so a separate read is unnecessary.
        const result = await Product.updateStock(item.productId, item.quantity, options);
        if (!result) {
          throw new ApiError(400, `Product ${item.productId} is missing or has insufficient stock`);
        }
        pricedItems.push({
          productId: item.productId,
          quantity: item.quantity,
          price: result.price,
        });
      }

      const totalAmount = pricedItems.reduce(
        (total, item) => total + Number(item.price) * item.quantity,
        0,
      ).toFixed(2);
      createdOrder = await Order.create({ userId, totalAmount }, options);
      const orderItems = [];
      for (const item of pricedItems) {
        orderItems.push(await Order.createItem({
          orderId: createdOrder.id,
          productId: item.productId,
          quantity: item.quantity,
          priceAtPurchase: item.price,
        }, options));
      }
      createdOrder.items = orderItems;
    });

    return createdOrder;
  } finally {
    await session.endSession();
  }
}

module.exports = { createOrder };
