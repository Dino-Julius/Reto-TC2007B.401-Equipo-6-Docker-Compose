const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const userController = require('../controllers/userController');
const zazil_users_path = process.env.zazil_users_path;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, zazil_users_path);
    },
    filename: (req, file, cb) => {
        const { first_name, last_name } = req.body;
        // const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        // cb(null, `${timestamp}_${first_name}_${last_name}${ext}`);
        cb(null, `${first_name}_${last_name}${ext}`);
    },
});

const upload = multer({ storage });

// Definir las rutas para la API de usuarios
router.get('/users', userController.getUsers); // Obtener todos los usuarios
router.get('/users/:email', userController.getUserByEmail); // Obtener un usuario por su correo electrónico
router.post('/users', upload.single('profile_pic'), userController.createUser); // Crear un nuevo usuario con carga de imagen
router.put('/users/:email', userController.updateUserByEmail); // Actualizar un usuario por su correo electrónico
router.put('/users/:email/profile_pic', upload.single('profile_pic'), userController.updateUserProfilePicByEmail); // Actualizar solo la imagen de perfil de un usuario
router.delete('/users/:email', userController.deleteUserByEmail); // Eliminar un usuario por su correo electrónico

module.exports = router;