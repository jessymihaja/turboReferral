const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpiresIn } = require('../config/env');
const asyncHandler = require('../utils/asyncHandler');
const ResponseHandler = require('../utils/responseHandler');
const { AppError } = require('../utils/errorHandler');

exports.register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) {
    throw new AppError('Username or email already in use', 400);
  }

  const user = new User({ username, email, password });
  await user.save();

  ResponseHandler.created(res, null, 'User created successfully');
});

exports.login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  // Allow login with either username or email
  const user = await User.findOne({
    $or: [{ username }, { email: username }]
  });

  if (!user) {
    throw new AppError('Invalid credentials', 400);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError('Invalid credentials', 400);
  }

  const payload = { id: user._id, username: user.username, role: user.role };
  const token = jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiresIn });

  const userData = {
    _id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
  };

  ResponseHandler.success(res, { user: userData, token }, 'Login successful');
});
