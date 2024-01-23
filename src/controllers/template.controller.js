const fs = require('fs');
const { Router } = require('express')
const Cart = require('../models/carts.model')
const prompt = require('prompt-sync')(); // Importa la librería prompt-sync
const FilesDao = require('../dao/files.dao');
const Messages = require('../models/messages.model');
const productController = require('./product.controller'); // Asegúrate de tener tu controlador de productos
const Products = require('../models/products.model');

const chatFile = new FilesDao('chats.json');

const router = Router()

router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort === 'desc' ? -1 : 1;
    const query = req.query.query || {};

    const options = {
      limit,
      page,
      sort: { price: sort }, // Ordenar por precio ascendente o descendente
    };

    // Realizar la búsqueda en base a la consulta
    const products = await Products.paginate(query, options);

    res.json(products);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error del servidor al obtener productos' });
  }
});

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

    res.render('inicio.handlebars', { products,categories,categoryCounts,estilo: 'estilos.css'});
  } catch (error) {
    console.error('Error al obtener productos de la base de datos:', error);
    res.status(500).json({ error: 'Error del servidor al obtener productos' });
  }
});

router.get('/:category', async (req, res) => {
  try {
    const category = req.params.category;
    const products = await productController.getProductsByCategory(category);
    const categoryCounts = await productController.getCategoriesAndCount();
    res.render('categoria.handlebars', { products, category,categoryCounts,estilo: 'estilos.css'});
  } catch (error) {
    console.error('Error al obtener productos por categoría:', error);
    res.status(500).json({ error: 'Error del servidor al obtener productos por categoría' });
  }
});


router.get('/products', async (req, res) => {
  try {
    const products = await Products.find()
    res.json({ payload: products })
  } catch (error) {
    res.json({ error })
  }
})

router.post('/products', async (req, res) => {
  try {
    const { name, category, description, price, imageUrl } = req.body;

    const newProductInfo = {
      name,
      category,
      description,
      price,
      imageUrl,
    };

    // Crear el producto en MongoDB
    const newProduct = await Products.create(newProductInfo);

    // Crear índices si no existen
    const indexDefinitions = [
      { name: 1, category: 1 },
      // Agrega aquí otros índices que desees crear
    ];

    for (const indexDefinition of indexDefinitions) {
      const indexExists = await Products.collection.indexExists(indexDefinition);
      if (!indexExists) {
        await Products.collection.createIndex(indexDefinition);
      }
    }

    res.json({ payload: newProduct });
  } catch (error) {
    console.error('Error al crear producto en MongoDB:', error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});



router.get('/cart', async (req, res) => {
  try {
    const carts = await Cart.find()
    res.json({ payload: carts })
  } catch (error) {
    res.json({ error })
  }
})

router.get('/cart/:id', async (req, res) => {
  try {
    const { id } = req.params

    const user = await Cart.findOne()
    res.json({ payload: user })
  } catch (error) {
    res.json({ error })
  }
})

router.post('/cart/', async (req, res) => {
  try {
    const { user, products, total } = req.body

    const newCartInfo = {
      user,
      products,
      total
    }

    const newCart = await Cart.create(newCartInfo)

    res.json({ payload: newCart })
  } catch (error) {
    res.json({ error: error.message })
  }
})

router.put('/cart/:id', async (req, res) => {
  try {
    const { id } = req.params
    const body = req.body

    await Cart.updateOne({ _id: id }, body)

    res.json({ payload: 'Usuario actualizado' })
  } catch (error) {
    console.log(error)
    res.json({ error })
  }
})

router.delete('/cart/:id', async (req, res) => {
  try {
    const { id } = req.params

    await Cart.updateOne({ _id: id })

    res.json({ payload: 'Usuario eliminado' })
  } catch (error) {
    console.log(error)
    res.json({ error })
  }
})


//FileSystem
router.get('/chat', (req, res) => {
  res.render('chat.handlebars');
});

router.get('/chat/cargarChat', async (req, res) => {
  try {
    const messages = await chatFile.getItems();
    res.json({ status: 'success', messages });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

//Mongodb
router.post('/chat/in', async (req, res) => {
  try {
    const { user, message } = req.body;

    const newUserInfo = {
      user,
      message
    };

    const newUser = await Messages.create(newUserInfo);

    res.json({ payload: newUser });
  } catch (error) {
    console.error('Error al crear mensaje en MongoDB:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/inicio', (req, res) => {
  res.render('inicio.handlebars');
});


module.exports = router
