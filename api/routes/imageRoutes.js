// routes/imageRoutes.js
const express = require('express');
const router = express.Router();
const ImageController = require('../controllers/ImageController');

// Ruta para subir imágenes
router.post('/upload', ImageController.upload, ImageController.uploadImage);

module.exports = router;
