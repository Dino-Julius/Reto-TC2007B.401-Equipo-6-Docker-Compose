const userModel = require('../models/userModel');
const moment = require('moment');
const path = require('path');
const fs = require('fs');
const BASE_URL = process.env.BASE_URL;
const zazil_users_path = process.env.zazil_users_path;

/**
 * Obtener todos los usuarios
 * @param {Object} req - Objeto de solicitud HTTP
 * @param {Object} res - Objeto de respuesta HTTP
 */
const getUsers = async (req, res) => {
    try {
        const users = await userModel.getUsers();
        // Formatear la fecha de nacimiento y construir la URL completa de la imagen de perfil
        const formattedUsers = users.map(user => ({
            ...user,
            birth_date: moment(user.birth_date).format('YYYY-MM-DD'),
            profile_pic: user.profile_pic ? `${BASE_URL}${user.profile_pic}` : null
        }));
        res.status(200).json(formattedUsers);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
};

/**
 * Obtener un usuario por su correo electrónico
 * @param {Object} req - Objeto de solicitud HTTP
 * @param {Object} res - Objeto de respuesta HTTP
 */
const getUserByEmail = async (req, res) => {
    const { email } = req.params;
    try {
        const user = await userModel.getUserByEmail(email);
        if (user) {
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
 * Crear un nuevo usuario
 * @param {Object} req - Objeto de solicitud HTTP
 * @param {Object} res - Objeto de respuesta HTTP
 */
const createUser = async (req, res) => {
    const userData = req.body;
    if (req.file) {
        userData.profile_pic = `/media/zazil_users/${userData.first_name}_${userData.last_name}${path.extname(req.file.originalname)}`; // Ruta relativa que Nginx servirá
    }
    try {
        const newUser = await userModel.createUser(userData);
        newUser.profile_pic = newUser.profile_pic ? `${BASE_URL}${newUser.profile_pic}` : null;
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error al crear el usuario:', error);
        // Eliminar el archivo si hubo un error al crear el usuario
        if (req.file) {
            const fullPath = path.join(zazil_users_path, path.basename(userData.profile_pic));
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
 * Actualizar un usuario por su correo electrónico
 * @param {Object} req - Objeto de solicitud HTTP
 * @param {Object} res - Objeto de respuesta HTTP
 */
const updateUserByEmail = async (req, res) => {
    const { email } = req.params;
    const userData = req.body;
    try {
        const updatedUser = await userModel.updateUserByEmail(email, userData);
        if (updatedUser) {
            updatedUser.profile_pic = updatedUser.profile_pic ? `${BASE_URL}${updatedUser.profile_pic}` : null;
            res.status(200).json(updatedUser);
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el usuario' });
    }
};

// ! NO SE ACTUALIZA CORRECTAMENTE LA IMAGEN EN EL SERVIDOR DE NGINX (undefined_undefined.jpg)
/**
 * Actualizar solo la imagen de perfil de un usuario por su correo electrónico
 * @param {Object} req - Objeto de solicitud HTTP
 * @param {Object} res - Objeto de respuesta HTTP
 */
const updateUserProfilePicByEmail = async (req, res) => {
    const { first_name, last_name } = req.body;
    const { email } = req.params;
    try {
        const user = await userModel.getUserByEmail(email);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        if (req.file) {
            const newProfilePic = `/media/zazil_users/${first_name}_${last_name}${path.extname(req.file.originalname)}`;
            const updatedUser = await userModel.updateUserProfilePicByEmail(email, newProfilePic);

            // Eliminar la imagen de perfil anterior del servidor
            if (user.profile_pic) {
                const fullPath = path.join(zazil_users_path, path.basename(user.profile_pic));
                console.log(fullPath);
                fs.unlink(fullPath, (err) => {
                    if (err) {
                        console.error('Error al eliminar el archivo:', err);
                    } else {
                        console.log('Imagen de perfil eliminada:', user.profile_pic);
                    }
                });
            }

            updatedUser.profile_pic = `${BASE_URL}${updatedUser.profile_pic}`;
            res.status(200).json(updatedUser);
        } else {
            res.status(400).json({ error: 'No se proporcionó ninguna imagen' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la imagen de perfil' });
    }
};

/**
 * Eliminar un usuario por su correo electrónico
 * @param {Object} req - Objeto de solicitud HTTP
 * @param {Object} res - Objeto de respuesta HTTP
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
                    } else {
                        console.log('Imagen de perfil eliminada:', deletedUser.profile_pic);
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
    getUsers,
    getUserByEmail,
    createUser,
    updateUserByEmail,
    updateUserProfilePicByEmail,
    deleteUserByEmail,
};