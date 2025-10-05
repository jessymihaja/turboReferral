const Category = require('../models/Category');
const asyncHandler = require('../utils/asyncHandler');
const ResponseHandler = require('../utils/responseHandler');
const { AppError } = require('../utils/errorHandler');
const { t } = require('../utils/i18n');

exports.createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const existing = await Category.findOne({ name });
  if (existing) {
    throw new AppError(t('errors.alreadyExists', { field: 'Catégorie' }), 400);
  }

  const category = new Category({ name, description });
  await category.save();

  ResponseHandler.created(res, category, t('category.categoryCreated'));
});

exports.getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });
  ResponseHandler.success(res, categories);
});

exports.updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  const category = await Category.findById(id);
  if (!category) {
    throw new AppError(t('errors.notFound', { field: 'Catégorie' }), 404);
  }

  if (name && name !== category.name) {
    const existing = await Category.findOne({ name });
    if (existing) {
      throw new AppError(t('errors.alreadyExists', { field: 'Catégorie' }), 400);
    }
    category.name = name;
  }

  if (description !== undefined) {
    category.description = description;
  }

  await category.save();

  ResponseHandler.success(res, category, t('category.categoryUpdated'));
});

exports.deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await Category.findById(id);
  if (!category) {
    throw new AppError(t('errors.notFound', { field: 'Catégorie' }), 404);
  }

  await category.deleteOne();

  ResponseHandler.success(res, null, t('category.categoryDeleted'));
});
