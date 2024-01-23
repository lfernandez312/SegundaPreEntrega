const express = require('express');
const router = express.Router();

router.get('/api/:category/:availability?/:limit?', async (req, res) => {
  try {
    const category = req.params.category;
    const availability = req.params.availability; // Puede ser undefined si no se proporciona
    const limit = req.params.limit || 10;

    const result = await productController.getProductsByCategoryAndAvailability(category, availability, limit);
    res.json(result);
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    res.status(500).json({ status: 'error', error: 'Error del servidor al obtener productos' });
  }
});

module.exports = router;
