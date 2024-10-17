const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// const orderModel = require('../models/orderModel');
// const orderItemModel = require('../models/orderItemModel');
const orderController = require('./orderController');
const STRIPE_RETURN_url = process.env.STRIPE_RETURN_url;

// Crear un PaymentIntent
const createPaymentIntent = async (req, res) => {
    const { amount, payment_method } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'mxn',
            payment_method: payment_method,
            confirmation_method: 'automatic',
            confirm: true,
            return_url: `${STRIPE_RETURN_url}`,
        });

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).send({ error: error.message });
    }
};

// Nueva función para manejar las solicitudes POST a /receive-order
const reciveOrder = async (req, res) => {
    const { address, email, items } = req.body;

    if (!address || !email || !items) {
        // Si falta algún dato, enviar una respuesta de error
        return res.status(400).send({ message: "Missing required fields" });
    }

    console.log(req.body);

    try {
        // Llamar a createOrderWithItems del controlador de órdenes
        await orderController.createOrderWithItems(req, res);
    } catch (error) {
        // Enviar una respuesta de vuelta al cliente
        console.error('Error processing order:', error);
        res.status(500).send({ message: "Error processing order" });
    }
};

module.exports = {
    createPaymentIntent,
    reciveOrder,
};