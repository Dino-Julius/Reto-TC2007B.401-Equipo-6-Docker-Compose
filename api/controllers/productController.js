// controllers/productController.js

const productModel = require('../models/productModel');

// Crear un nuevo producto
const createProduct = async (req, res) => {
  const productData = req.body;
  if (req.file) {
    productData.image_path = `/media/zazil_products/${req.file.filename}`; // Ruta relativa que Nginx servirá
  }
  try {
    const newProduct = await productModel.createProduct(productData);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error al crear el producto:', error);
    res.status(500).json({ error: 'Error al crear el producto' });
  }
};

// Obtener todos los productos
const getAllProducts = async (req, res) => {
  try {
    const products = await productModel.getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
};

// Obtener un producto por su SKU
const getProductBySku = async (req, res) => {
    const { sku } = req.params;
    try {
        const product = await productModel.getProductBySku(sku);
        if (product) {
            // Asegúrate de que la URL de la imagen esté incluida en la respuesta
            product.imageUrl = `http://localhost${product.image_path}`;
            res.status(200).json(product);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductBySku,
};