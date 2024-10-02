const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');

// Definir las rutas para la API de direcciones
router.post('/addresses', addressController.createAddress); // Crear una nueva dirección
router.get('/addresses/:address_id', addressController.getAddressById); // Obtener una dirección por su ID
router.put('/addresses/:user_id/:address_id', addressController.updateAddressById); // Modificar una dirección por user_id y address_id

module.exports = router;