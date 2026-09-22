const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');
const { sendSuccess } = require('../utils/response');

function createToken(user) {
  return jwt.sign({ id: user.id, email: user.email, name: user.name }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
}

async function register(req, res) {
  const passwordHash = await bcrypt.hash(req.body.password, 12);
  const user = await User.create({ ...req.body, passwordHash });
  return sendSuccess(res, { user, token: createToken(user) }, 201);
}

async function login(req, res) {
  const user = await User.findByEmail(req.body.email);
  if (!user || !(await bcrypt.compare(req.body.password, user.passwordHash))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const safeUser = { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt };
  return sendSuccess(res, { user: safeUser, token: createToken(safeUser) });
}

module.exports = { register, login };
