const express = require('express');
const templatesController = require('../controllers/template.controller');
const productController = require('../controllers/product.controller');

const router = express.Router();

router.get('/categories-and-count', async (req, res) => {
    try {
        const categories = await productController.getCategories();
        res.json({ categories });
    } catch (error) {
        console.error('Error al obtener categorías y cantidad de productos por categoría:', error);
        res.status(500).json({ error: 'Error del servidor al obtener categorías y cantidad de productos por categoría' });
    }
});

module.exports = router;
