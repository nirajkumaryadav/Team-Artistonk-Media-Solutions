const express = require('express');
const { z } = require('zod');
const productController = require('../controllers/product.controller');
const asyncHandler = require('../utils/asyncHandler');
const validate = require('../middlewares/validate.middleware');

const router = express.Router();
const idSchema = z.object({ id: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid MongoDB id') });
const productFields = {
  name: z.string().trim().min(1).max(180),
  description: z.string().max(5000).nullable().optional(),
  price: z.coerce.number().nonnegative(),
  stockQuantity: z.coerce.number().int().nonnegative(),
  category: z.string().trim().max(100).nullable().optional(),
};
const createSchema = z.object(productFields);
const updateSchema = z.object(productFields).partial().refine((value) => Object.keys(value).length > 0, {
  message: 'At least one field is required',
});
const querySchema = z.object({
  search: z.string().trim().max(100).optional(),
  category: z.string().trim().max(100).optional(),
  inStock: z.enum(['true', 'false']).transform((value) => value === 'true').optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

router.post('/', validate(createSchema), asyncHandler(productController.create));
router.get('/', validate(querySchema, 'query'), asyncHandler(productController.findAll));
router.get('/:id', validate(idSchema, 'params'), asyncHandler(productController.findById));
router.patch('/:id', validate(idSchema, 'params'), validate(updateSchema), asyncHandler(productController.update));
router.delete('/:id', validate(idSchema, 'params'), asyncHandler(productController.remove));

module.exports = router;
