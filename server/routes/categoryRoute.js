const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Créer une catégorie
router.post('/', categoryController.createCategory);

// Récupérer toutes les catégories
router.get('/', categoryController.getAllCategories);

module.exports = router;
