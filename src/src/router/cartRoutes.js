const express = require('express');
const cartsController = require('../controllers/carts.controller');

const router = express.Router();

//ya se encuentra el /cart cargado en app.js

router.get('/info', async (req, res) => {
    try {      
      const cartInfo = await cartsController.getCartInfo();
      res.render('cart.handlebars', { cartInfo, estilo: 'estilos.css' });
      //res.json({ payload: cartInfo });
    } catch (error) {
      console.error('Error al obtener información del carrito:', error);
      res.status(500).json({ error: 'Error del servidor al obtener información del carrito' });
    }
});

router.get('/carrito', async (req, res) => {
    try {
        const carts = await cartsController.getAllCarts();
        res.json({ payload: carts });
    } catch (error) {
        res.json({ error });
    }
});

router.get('/carrito/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const populatedCart = await cartsController.getCartByIdPopulated(id);
        res.json({ payload: populatedCart });
    } catch (error) {
        console.error('Error al obtener el carrito con productos completos:', error);
        res.status(500).json({ error: 'Error del servidor al obtener el carrito con productos completos' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { user, products, total } = req.body;
        const newCartInfo = { user, products, total };
        const newCart = await cartController.createCart(newCartInfo);
        res.json({ payload: newCart });
    } catch (error) {
        res.json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const body = req.body;
        await cartsController.updateCart(id, body);
        res.json({ payload: 'Carrito actualizado' });
    } catch (error) {
        console.log(error);
        res.json({ error });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await cartsController.deleteCart(id);
        res.json({ payload: 'Carrito eliminado' });
    } catch (error) {
        console.log(error);
        res.json({ error });
    }
});

router.get('/:id/total', async (req, res) => {
    try {
        const { id } = req.body;
        const totalPrice = await cartsController.getCartTotalPrice(id);
        res.json({ status: 'success', totalPrice });
    } catch (error) {
        console.error('Error al obtener el precio total del carrito desde router:', error);
        res.status(500).json({ status: 'error', error: 'Error al obtener el precio total del carrito desde router' });
    }
});

router.post('/agregar', async (req, res) => {
    try {
        const productId = req.body.productId;
        const user = "lfernandez"; // Ajusta esto según cómo obtienes al usuario

        // Lógica para agregar el producto al carrito en tu controlador
        // Asegúrate de tener la función 'addToCart' en tu controlador de carritos
        await cartsController.addToCart(user, productId);

        res.json({ status: 'success', message: 'Producto agregado al carrito con éxito' });
    } catch (error) {
        console.error('Error al agregar al carrito:', error);
        res.status(500).json({ status: 'error', error: 'Error al agregar al carrito' });
    }
});

module.exports = router;