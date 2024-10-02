// server.js

require('dotenv').config();  // Cargar las variables de entorno desde el archivo .env

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Rutas
console.log('Servidor reiniciado'); // Agrega esta línea

app.use('/api', userRoutes);
app.use('/api', productRoutes);

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});