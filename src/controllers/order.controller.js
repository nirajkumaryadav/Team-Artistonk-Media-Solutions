const Order = require('../models/order.model');
const orderService = require('../services/order.service');
const ApiError = require('../utils/ApiError');
const { sendSuccess } = require('../utils/response');

async function create(req, res) {
  const order = await orderService.createOrder(req.user.id, req.body.items);
  return sendSuccess(res, order, 201);
}

async function findAll(req, res) {
  const orders = await Order.findAllByUserId(req.user.id);
  return sendSuccess(res, orders);
}

async function findById(req, res) {
  const order = await Order.findById(req.params.id, req.user.id);
  if (order) return sendSuccess(res, order);

  const existingOrder = await Order.findById(req.params.id);
  if (existingOrder) throw new ApiError(403, 'You cannot access this order');
  throw new ApiError(404, 'Order not found');
}

module.exports = { create, findAll, findById };
