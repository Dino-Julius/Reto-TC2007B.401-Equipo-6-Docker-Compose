// routes/productRoutes.js

const express = require('express');
const multer = require('multer');
const router = express.Router();
const productController = require('../controllers/productController');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '/usr/share/nginx/html/media/zazil_products');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

// Definir las rutas para la API de productos
router.post('/products', upload.single('image_path'), productController.createProduct); // Crear un nuevo producto con carga de imagen
router.get('/products', productController.getAllProducts); // Obtener todos los productos
router.get('/products/sku/:sku', productController.getProductBySku); // Obtener un producto por su SKU

module.exports = router;