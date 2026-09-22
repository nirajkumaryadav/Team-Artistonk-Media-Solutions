const Product = require('../models/product.model');
const ApiError = require('../utils/ApiError');
const { sendSuccess } = require('../utils/response');

async function create(req, res) {
  const product = await Product.create(req.body);
  return sendSuccess(res, product, 201);
}

async function findAll(req, res) {
  const { page, limit, search, category, inStock } = req.query;
  const products = await Product.findAll({
    page,
    limit,
    search,
    category,
    inStock,
    offset: (page - 1) * limit,
  });
  return sendSuccess(res, { products, page, limit });
}

async function findById(req, res) {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found');
  return sendSuccess(res, product);
}

async function update(req, res) {
  const existing = await Product.findById(req.params.id);
  if (!existing) throw new ApiError(404, 'Product not found');
  const product = await Product.update(req.params.id, {
    name: req.body.name ?? existing.name,
    description: req.body.description ?? existing.description,
    price: req.body.price ?? existing.price,
    stockQuantity: req.body.stockQuantity ?? existing.stockQuantity,
    category: req.body.category ?? existing.category,
  });
  return sendSuccess(res, product);
}

async function remove(req, res) {
  const product = await Product.remove(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found');
  return sendSuccess(res, { id: product.id });
}

module.exports = { create, findAll, findById, update, remove };
