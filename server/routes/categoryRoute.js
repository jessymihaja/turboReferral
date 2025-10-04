const express = require('express');
const router = express.Router();
const adminAuthMiddleware = require('../middlewares/adminAuth');
const { categoryValidators } = require('../utils/validators');
const { createCategory, getAllCategories } = require('../controllers/categoryController');

router.post('/', adminAuthMiddleware, categoryValidators.create, createCategory);
router.get('/', getAllCategories);

module.exports = router;
