// controllers/productController.js

const productModel = require('../models/productModel');

// Crear un nuevo producto
const createProduct = async (req, res) => {
    const productData = req.body;
    try {
        const newProduct = await productModel.createProduct(productData);
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error al crear el producto:', error);
        res.status(500).json({ error: 'Error al crear el producto' });
    }
};

module.exports = {
    createProduct,
};