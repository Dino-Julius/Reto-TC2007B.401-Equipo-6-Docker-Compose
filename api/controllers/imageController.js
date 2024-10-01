// controllers/imageController.js
const multer = require('multer');
const path = require('path');

// Configuración de multer para almacenar imágenes en un directorio específico
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Cambia esto a tu directorio deseado
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Agrega un timestamp para evitar conflictos de nombre
    },
});

const upload = multer({ storage: storage });

// Controlador para manejar la subida de imágenes
exports.uploadImage = (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    res.status(200).json({
        message: 'File uploaded successfully',
        filename: req.file.filename,
    });
};

// Exporta el middleware de multer para usar en las rutas
