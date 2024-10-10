const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const STRIPE_RETURN_url = process.env.STRIPE_RETURN_url;

// Crear un PaymentIntent
const createPaymentIntent = async (req, res) => {
    const { amount, payment_method } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'usd',
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

module.exports = {
    createPaymentIntent,
};