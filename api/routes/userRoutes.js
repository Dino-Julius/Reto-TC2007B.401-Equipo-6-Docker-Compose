const express = require('express');
const multer = require('multer');
const moment = require('moment');
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
        if (!first_name || !last_name) {
            return cb(new Error('First name and last name are required'), null);
        }
        let pro_pic = `${first_name}_${last_name}`;
        pro_pic = pro_pic.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        pro_pic = pro_pic.replace(/\s+/g, '-').toLowerCase();
        pro_pic = pro_pic.replace(/[^a-z0-9\-]/g, '');
        const ext = path.extname(file.originalname);
        cb(null, `${moment(Date.now()).format("DD-MM-YYYY")}_${pro_pic}${ext}`);
    },
});

const upload = multer({ storage });

// Definir las rutas para la API de usuarios
router.post('/users', userController.createUser); // Crear un nuevo usuario sin carga de imagen
router.post('/user/login/:email', userController.loginUserByEmail); // Login de usuario por su correo electrónico
router.get('/users', userController.getUsers); // Obtener todos los usuarios
router.get('/users/:email', userController.getUserByEmail); // Obtener un usuario por su correo electrónico
router.put('/users/:email', upload.single('profile_pic'), userController.updateUserByEmail); // Actualizar un usuario por su correo electrónico
router.delete('/users/:email', userController.deleteUserByEmail); // Eliminar un usuario por su correo electrónico

module.exports = router;