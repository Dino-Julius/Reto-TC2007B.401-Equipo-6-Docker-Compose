const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Definir las rutas para la API de órdenes
router.post('/orders', orderController.createOrder); // Crear una nueva orden
router.post('/orders/withitems', orderController.createOrderWithItems); // Crear una nueva orden con items
router.get('/orders', orderController.getAllOrders); // Obtener todas las órdenes
router.get('/orders/:order_id', orderController.getOrderById); // Obtener una orden por su ID
router.put('/orders/:order_id', orderController.updateOrderById); // Actualizar una orden por su ID
router.get('/orders/user/:user_email', orderController.getOrdersByUserEmail); // Obtener órdenes por user_email

module.exports = router;    