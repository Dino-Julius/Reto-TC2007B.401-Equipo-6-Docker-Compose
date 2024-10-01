// routes/productRoutes.js

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Definir las rutas para la API de productos
router.post('/products', productController.createProduct); // Crear un nuevo producto

module.exports = router;