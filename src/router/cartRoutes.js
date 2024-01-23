const express = require('express');
const cartsController = require('../controllers/carts.controller');

const router = express.Router();

router.get('/cart/carrito', async (req, res) => {
    try {
        const carts = await cartsController.getAllCarts();
        res.json({ payload: carts });
    } catch (error) {
        res.json({ error });
    }
});

router.get('/cart/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await cartsController.getCartById(id);
        res.json({ payload: user });
    } catch (error) {
        res.json({ error });
    }
});

router.post('/cart/', async (req, res) => {
    try {
        const { user, products, total } = req.body;
        const newCartInfo = { user, products, total };
        const newCart = await cartController.createCart(newCartInfo);
        res.json({ payload: newCart });
    } catch (error) {
        res.json({ error: error.message });
    }
});

router.put('/cart/:id', async (req, res) => {
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

router.delete('/cart/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await cartsController.deleteCart(id);
        res.json({ payload: 'Carrito eliminado' });
    } catch (error) {
        console.log(error);
        res.json({ error });
    }
});

module.exports = router;