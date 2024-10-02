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

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// // Middleware para manejar rutas no encontradas (404)
// app.use((req, res, next) => {
//     res.status(404).json({ error: 'No hay nada aquí. La ruta solicitada no existe.' });
// });

// // Opcional: Middleware para manejar errores generales
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).json({ error: 'Algo salió mal. Por favor, inténtalo de nuevo más tarde.' });
// });

// Rutas
console.log('Servidor reiniciado');

app.use('/api', userRoutes);
app.use('/api', productRoutes);
app.use('/api', partnerRoutes);
app.use('/api', addressRoutes);
app.use('/api', postRoutes);
app.use('/api', orderRoutes);
app.use('/api', orderItemRoutes);

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});