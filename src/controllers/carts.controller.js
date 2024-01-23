const Cart = require('../models/carts.model');

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

};

module.exports = cartsController;
