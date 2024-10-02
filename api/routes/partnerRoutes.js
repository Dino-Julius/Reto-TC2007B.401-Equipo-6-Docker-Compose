// routes/partnerRoutes.js

const express = require('express');
const router = express.Router();
const partnerController = require('../controllers/partnerController');

// Definir las rutas para la API de socios
router.post('/partners', partnerController.createPartner); // Crear un nuevo socio
router.get('/partners', partnerController.getAllPartners); // Obtener todos los socios
router.get('/partners/:partner_id', partnerController.getPartnerById); // Obtener un socio por su ID

module.exports = router;