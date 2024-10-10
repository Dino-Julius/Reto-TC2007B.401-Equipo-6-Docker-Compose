require('dotenv').config();  // Cargar las variables de entorno desde el archivo .env

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const partnerRoutes = require('./routes/partnerRoutes');
const addressRoutes = require('./routes/addressRoutes');
const postRoutes = require('./routes/postRoutes');
const orderRoutes = require('./routes/orderRoutes');
const orderItemRoutes = require('./routes/orderItemRoutes');
const stripeRoutes = require('./routes/stripeRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración CORS
const corsOptions = {
    origin: process.env.CORS_ORIGIN,
    optionsSuccessStatus: 200,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type,Authorization"
};

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());

// Rutas
app.use('/api', userRoutes);
app.use('/api', productRoutes);
app.use('/api', partnerRoutes);
app.use('/api', addressRoutes);
app.use('/api', postRoutes);
app.use('/api', orderRoutes);
app.use('/api', orderItemRoutes);
app.use('/api', stripeRoutes);

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});