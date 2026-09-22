const express = require('express');
const { z } = require('zod');
const authController = require('../controllers/auth.controller');
const asyncHandler = require('../utils/asyncHandler');
const validate = require('../middlewares/validate.middleware');

const router = express.Router();
const credentialsSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  email: z.string().trim().email().transform((value) => value.toLowerCase()),
  password: z.string().min(8).max(72),
});
const registerSchema = credentialsSchema.extend({ name: z.string().trim().min(1).max(120) });

router.post('/register', validate(registerSchema), asyncHandler(authController.register));
router.post('/login', validate(credentialsSchema.omit({ name: true })), asyncHandler(authController.login));

module.exports = router;
