const Category = require('../models/Category');
const asyncHandler = require('../utils/asyncHandler');
const ResponseHandler = require('../utils/responseHandler');
const { AppError } = require('../utils/errorHandler');

exports.createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const existing = await Category.findOne({ name });
  if (existing) {
    throw new AppError('Category already exists', 400);
  }

  const category = new Category({ name, description });
  await category.save();

  ResponseHandler.created(res, category, 'Category created successfully');
});

exports.getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });
  ResponseHandler.success(res, categories);
});
