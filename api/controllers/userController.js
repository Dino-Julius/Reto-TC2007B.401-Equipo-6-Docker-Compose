const userModel = require('../models/userModel');
const moment = require('moment');
const path = require('path');
const fs = require('fs');
const BASE_URL = process.env.BASE_URL;
const zazil_users_path = process.env.zazil_users_path;
const relative_zazil_users_path = process.env.relative_zazil_users_path;

/**
 * Crear un nuevo usuario
 */
const createUser = async (req, res) => {
    const userData = req.body;
    if (req.file) {
        userData.profile_pic = `${relative_zazil_users_path}${req.file.filename}`;
    }
    try {
        const newUser = await userModel.createUser(userData);
        newUser.birth_date = moment(newUser.birth_date).format('DD-MM-YYYY');
        newUser.profile_pic = newUser.profile_pic ? `${BASE_URL}${newUser.profile_pic}` : null;
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error al crear el usuario:', error);
        // Eliminar el archivo si hubo un error al crear el usuario
        if (req.file) {
            const fullPath = path.join(zazil_users_path, req.file.filename);
            console.log(fullPath);
            fs.unlink(fullPath, (err) => {
                if (err) {
                    console.error('Error al eliminar el archivo:', err);
                }
            });
        }
        res.status(500).json({ error: 'Error al crear el usuario' });
    }
};

/**
 * Obtener todos los usuarios
 */
const getUsers = async (req, res) => {
    try {
        const users = await userModel.getUsers();
        // Formatear la fecha de nacimiento y construir la URL completa de la imagen de perfil
        const formattedUsers = users.map(user => ({
            ...user,
            birth_date: moment(user.birth_date).format('DD-MM-YYYY'),
            profile_pic: user.profile_pic ? `${BASE_URL}${user.profile_pic}` : null
        }));
        res.status(200).json(formattedUsers);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
};

/**
 * Obtener un usuario por su correo electrónico
 */
const getUserByEmail = async (req, res) => {
    const { email } = req.params;
    try {
        const user = await userModel.getUserByEmail(email);
        if (user) {
            user.birth_date = moment(user.birth_date).format('DD-MM-YYYY');
            user.profile_pic = user.profile_pic ? `${BASE_URL}${user.profile_pic}` : null;
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el usuario' });
    }
};


/**
 * Actualizar un usuario por su correo electrónico
 */
const updateUserByEmail = async (req, res) => {
    const { email } = req.params;
    const userData = req.body;
    try {
        const user = await userModel.getUserByEmail(email);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        if (req.file) {
            userData.profile_pic = `${relative_zazil_users_path}${req.file.filename}`;
            const updatedUser = await userModel.updateUserByEmail(email, userData);
            if (updatedUser) {
                const fullPath = path.join(zazil_users_path, path.basename(user.profile_pic));
                fs.unlink(fullPath, (err) => {
                    if (err) {
                        console.error('Error al eliminar el archivo:', err);
                    }
                });
            }
            updatedUser.birth_date = moment(updatedUser.birth_date).format('DD-MM-YYYY');
            updatedUser.profile_pic = updatedUser.profile_pic ? `${BASE_URL}${updatedUser.profile_pic}` : null;
            res.status(200).json(updatedUser);
        } else {
            userData.profile_pic = user.profile_pic;
            const updatedUser = await userModel.updateUserByEmail(email, userData);
            updatedUser.birth_date = moment(updatedUser.birth_date).format('DD-MM-YYYY');
            updatedUser.profile_pic = updatedUser.profile_pic ? `${BASE_URL}${updatedUser.profile_pic}` : null;
            res.status(200).json(updatedUser);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el usuario' });
    }
};

/**
 * Eliminar un usuario por su correo electrónico
 */
const deleteUserByEmail = async (req, res) => {
    const { email } = req.params;
    try {
        const user = await userModel.getUserByEmail(email);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        const deletedUser = await userModel.deleteUserByEmail(email);
        if (deletedUser) {
            // Eliminar la imagen de perfil del servidor
            if (deletedUser.profile_pic) {
                const fullPath = path.join(zazil_users_path, path.basename(deletedUser.profile_pic));
                console.log(fullPath);
                fs.unlink(fullPath, (err) => {
                    if (err) {
                        console.error('Error al eliminar el archivo:', err);
                    }
                });
            }
            console.log('Usuario eliminado exitosamente:', email);
            res.status(200).json({ message: 'Usuario eliminado correctamente' });
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        res.status(500).json({ error: 'Error al eliminar el usuario' });
    }
};

module.exports = {
    createUser,
    getUsers,
    getUserByEmail,
    updateUserByEmail,
    deleteUserByEmail,
};