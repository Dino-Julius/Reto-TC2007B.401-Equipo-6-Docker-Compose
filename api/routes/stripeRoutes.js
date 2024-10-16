const express = require('express');
const router = express.Router();
const stripeController = require('../controllers/stripeController');

// Definir las rutas para la API de Stripe
router.post('/create-payment-intent', stripeController.createPaymentIntent);
router.post('/receive-order', stripeController.reciveOrder);

module.exports = router;