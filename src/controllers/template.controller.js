const Product = require('../models/products.model');


exports.getAllProducts = async (options) => {
    try {
        const products = await Product.paginate({}, options);
        //const products = await Product.paginate({}, options).populate('status');
        console.log("Datos de la base de datos (página actual):", products.docs);
        return products.docs;
    } catch (error) {
        console.error('Error al obtener productos de la base de datos:', error);
        throw error;
    }
};

exports.getCategories = async () => {
    try {
        const categories = await Product.distinct('category');
        return categories;
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        throw error;
    }
};

exports.getCategoriesAndCount = async (req, res) => {
    try {
        const categoryCounts = await Product.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            }
        ]);
        return categoryCounts;
    } catch (error) {
        console.error('Error al obtener categorías y cantidad de productos por categoría:', error);
        res.status(500).json({ error: 'Error del servidor al obtener categorías y cantidad de productos por categoría' });
    }
};

exports.getProductsByCategory = async (category) => {
  try {
    const products = await Product.find({ category: category });
    return products;
  } catch (error) {
    console.error(`Error al obtener productos por categoría (${category}):`, error);
    throw error;
  }
};

exports.getProductsByCategoryAndAvailability = async (category, availability, limit, page) => {
    try {
        const query = {
            category,
        };

        if (availability !== undefined) {
            query.status = availability;
        }

        const options = {
            page: page || 1,
            limit: limit || 10,
        };

        const result = await Product.paginate(query, options);

        return {
            status: 'success',
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.prevLink,
            nextLink: result.nextLink,
        };
    } catch (error) {
        console.error('Error al obtener productos por categoría y disponibilidad:', error);
        throw error;
    }
};

