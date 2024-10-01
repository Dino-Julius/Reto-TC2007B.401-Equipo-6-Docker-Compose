// controllers/userController.js

const userModel = require('../models/userModel');

// Obtener todos los usuarios
const getUsers = async (req, res) => {
    try {
        const users = await userModel.getUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
};

// Crear un nuevo usuario
const createUser = async (req, res) => {
    const userData = req.body;
    try {
        const newUser = await userModel.createUser(userData);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el usuario' });
    }
};

module.exports = {
    getUsers,
    createUser,
};
