// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Definir las rutas para la API de usuarios
router.get('/users', userController.getUsers); // Obtener todos los usuarios
router.post('/users', userController.createUser); // Crear un nuevo usuario

module.exports = router;
