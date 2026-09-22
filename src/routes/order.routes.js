const express = require('express');
const { z } = require('zod');
const orderController = require('../controllers/order.controller');
const asyncHandler = require('../utils/asyncHandler');
const validate = require('../middlewares/validate.middleware');
const { authenticate } = require('../middlewares/auth.middleware');

const router = express.Router();
const idSchema = z.object({ id: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid MongoDB id') });
const createOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid MongoDB id'),
    quantity: z.coerce.number().int().positive(),
  })).min(1).max(100),
});

router.use(authenticate);
router.post('/', validate(createOrderSchema), asyncHandler(orderController.create));
router.get('/', asyncHandler(orderController.findAll));
router.get('/:id', validate(idSchema, 'params'), asyncHandler(orderController.findById));

module.exports = router;
