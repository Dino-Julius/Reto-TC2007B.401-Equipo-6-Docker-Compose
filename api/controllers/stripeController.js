const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const orderModel = require('../models/orderModel');
const orderItemModel = require('../models/orderItemModel');
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
        // Crea la orden
        const orderData = {
            order_number: `ORD-${Date.now()}`, // Generar un número de orden único
            user_email: email,
            shipping_address: address,
            shipping_status: 'pending',
            order_date: new Date(),
            delivery_date: null,
            total_price: items.reduce((total, item) => total + item.price * item.quantity, 0) // Calcular el precio total
        };

        const newOrder = await orderModel.createOrder(orderData);

        // Crear los items de la orden
        for (const item of items) {
            const orderItemData = {
                order_number: newOrder.order_number,
                sku: item.sku,
                quantity: item.quantity,
                price: item.price // Asegúrate de que el precio esté incluido en los items
            };
            await orderItemModel.createOrderItem(orderItemData);
        }
        // Enviar una respuesta de vuelta al cliente
        console.log('Order processed successfully:', newOrder);
        res.status(200).send({ message: "Order received and processed successfully!" });
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