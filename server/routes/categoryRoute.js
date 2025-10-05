const express = require('express');
const router = express.Router();
const adminAuthMiddleware = require('../middlewares/adminAuth');
const { categoryValidators, idValidator } = require('../utils/validators');
const { createCategory, getAllCategories, updateCategory, deleteCategory } = require('../controllers/categoryController');

router.post('/', adminAuthMiddleware, categoryValidators.create, createCategory);
router.get('/', getAllCategories);
router.put('/:id', adminAuthMiddleware, idValidator, categoryValidators.create, updateCategory);
router.delete('/:id', adminAuthMiddleware, idValidator, deleteCategory);

module.exports = router;
