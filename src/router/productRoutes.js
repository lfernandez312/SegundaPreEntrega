const express = require('express');
const productController = require('../controllers/product.controller');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const mainProducts = await productController.getMainProducts();

    // Puedes renderizar la vista principal aquí o enviar los productos como JSON según tus necesidades
    res.render('main.handlebars', { mainProducts, estilo: 'estilos.css' });
  } catch (error) {
    console.error('Error al obtener los productos principales:', error);
    res.status(500).json({ error: 'Error del servidor al obtener productos principales' });
  }
});

router.get('/inicio', async (req, res) => {
  try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const options = {
          page,
          limit,
      };

      const categories = await productController.getCategories();
      const categoryCounts = await productController.getCategoriesAndCount();
      const products = await productController.getAllProducts(options);

      res.render('inicio.handlebars', { products, categories, categoryCounts, estilo: 'estilos.css' });
  } catch (error) {
      console.error('Error al obtener productos de la base de datos:', error);
      res.status(500).json({ error: 'Error del servidor al obtener productos' });
  }
});

router.get('/products', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const sort = req.query.sort === 'desc' ? -1 : 1;
        const options = { limit, page, sort: { price: sort } };

        const products = await productController.getAllProducts(options);
        res.json({ payload: products });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ error: 'Error del servidor al obtener productos' });
    }
});

router.post('/products', async (req, res) => {
    try {
        const { name, category, description, price, imageUrl } = req.body;
        const newProductInfo = { name, category, description, price, imageUrl };

        const newProduct = await productController.createProduct(newProductInfo);
        res.json({ payload: newProduct });
    } catch (error) {
        console.error('Error al crear producto en MongoDB:', error);
        res.status(500).json({ error: error.message, stack: error.stack });
    }
});

module.exports = router;