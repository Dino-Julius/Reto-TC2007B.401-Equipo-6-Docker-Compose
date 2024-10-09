const express = require('express');
const multer = require('multer');
const moment = require('moment');
const router = express.Router();
const productController = require('../controllers/productController');
const zazil_products_path = process.env.zazil_products_path;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, zazil_products_path)
    },
    filename: (req, file, cb) => {
        cb(null, moment(Date.now()).format('DD-MM-YYYY') + '_' + file.originalname);
    }
});

const upload = multer({ storage });

// Definir las rutas para la API de productos
router.post('/products', upload.single('image_path'), productController.createProduct); // Crear un nuevo producto con carga de imagen
router.get('/products', productController.getProducts); // Obtener todos los productos
router.get('/products/sku/:sku', productController.getProductBySku); // Obtener un producto por su SKU
router.get('/products/enabled', productController.getEnabledProducts); // Obtener todos los productos habilitados
router.put('/products/sku/:sku', upload.single('image_path'), productController.updateProductBySku); // Actualizar un producto por su SKU
router.put('/products/sku/:sku/status', productController.toggleProductStatusBySku); // Habilitar/deshabilitar un producto por su SKU
router.delete('/products/sku/:sku', productController.deleteProductBySku); // Eliminar un producto por su SKU

module.exports = router;