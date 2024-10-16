const express = require('express');
const router = express.Router();
const orderItemController = require('../controllers/orderItemController');

// Definir las rutas para la API de items de órdenes
router.post('/orderitems', orderItemController.createOrderItem); // Crear un nuevo item de orden
router.get('/orderitems/:order_number', orderItemController.getOrderItemsByOrderNumber); // Obtener todos los items de una orden
router.get('/orderitems/top-products', orderItemController.getTopProducts); // Obtener los 5 productos más vendidos
router.put('/orderitems/:order_item_id', orderItemController.updateOrderItemById); // Actualizar un item de orden por su ID
router.delete('/orderitems/:order_item_id', orderItemController.deleteOrderItemById); // Eliminar un item de orden por su ID

module.exports = router;