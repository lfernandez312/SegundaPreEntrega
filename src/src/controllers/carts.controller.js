const Cart = require('../models/carts.model');
const Products = require('../models/products.model');
const mongoose = require('mongoose');


const cartsController = {
    getAllCarts: async () => {
        try {
            const carts = await Cart.find();
            return carts;
        } catch (error) {
            console.error('Error al obtener todos los carritos:', error);
            throw error;
        }
    },

    getCartById: async (cartId) => {
        try {
            const cart = await Cart.findById(cartId);
            return cart;
        } catch (error) {
            console.error('Error al obtener el carrito por ID:', error);
            throw error;
        }
    },

    createCart: async (cartInfo) => {
        try {
            const newCart = await Cart.create(cartInfo);
            return newCart;
        } catch (error) {
            console.error('Error al crear un nuevo carrito:', error);
            throw error;
        }
    },

    updateCart: async (cartId, updatedInfo) => {
        try {
            const updatedCart = await Cart.findByIdAndUpdate(cartId, updatedInfo, { new: true });
            return updatedCart;
        } catch (error) {
            console.error('Error al actualizar el carrito por ID:', error);
            throw error;
        }
    },

    deleteCart: async (cartId) => {
        try {
            await Cart.findByIdAndDelete(cartId);
            return { message: 'Carrito eliminado con éxito' };
        } catch (error) {
            console.error('Error al eliminar el carrito por ID:', error);
            throw error;
        }
    },

    getCartByIdPopulated: async (cartId) => {
        try {
            const populatedCart = await Cart.findById(cartId).populate('user'); // Ajusta 'user' según tu esquema
            return populatedCart;
        } catch (error) {
            console.error('Error al obtener el carrito con usuario poblado:', error);
            throw error;
        }
    },

    addToCart: async (user, productId) => {
        try {
            // Obtén el carrito del usuario (si no existe, créalo)
            let cart = await Cart.findOne({ user });

            if (!cart) {
                cart = new Cart({ user, products: [] });
            }

            // Asegúrate de obtener los detalles del producto desde la base de datos
            const productDetails = await Products.findById(productId);

            if (!productDetails) {
                throw new Error('Producto no encontrado');
            }

            // Agrega el producto al carrito con los detalles requeridos
            cart.products.push({
                productId,
                name: productDetails.name,
                price: productDetails.price,
                quantity: 1,  // Puedes ajustar la cantidad según tus necesidades
            });

            // Guarda el carrito actualizado en la base de datos
            await cart.save();

            return cart;
        } catch (error) {
            console.error('Error al agregar al carrito:', error);
            throw error;
        }
    },

    getCartInfo: async () => {
        try {
          // Obtener información del carrito del usuario
          const userId = "lfernandez";
          const cart = await Cart.findOne({ user: userId }).populate('products');
    
          return cart;
        } catch (error) {
          console.error('Error al obtener información del carrito en controller:', error);
          throw error;
        }
    },
    

};

module.exports = cartsController;
