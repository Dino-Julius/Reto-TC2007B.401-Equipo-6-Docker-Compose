const userModel = require("../models/userModel");
const moment = require("moment");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");

const { BASE_URL, zazil_users_path, relative_zazil_users_path } = process.env;

/**
 * Controlador para crear un nuevo usuario
 */
const createUser = async (req, res) => {
    const userData = req.body;
    // Establecer una ruta de imagen por defecto
    userData.profile_pic = `${relative_zazil_users_path}default_profile_pic.jpg`;
    try {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        userData.password = hashedPassword;

        const newUser = await userModel.createUser(userData);
        newUser.birth_date = moment(newUser.birth_date).format("DD-MM-YYYY");
        newUser.profile_pic = newUser.profile_pic
            ? `${BASE_URL}${newUser.profile_pic}`
            : null;
        res.status(201).json({
            success: true,
            message: "Usuario creado correctamente",
            user: newUser,
        });
    } catch (error) {
        console.error("Error al crear el usuario:", error);
        res.status(500).json({
            success: false,
            error: "Error al crear el usuario",
            user: null,
        });
    }
};

/**
 * Verificar las credenciales del usuario
 */
const loginUserByEmail = async (req, res) => {
    const { email } = req.params;
    const { password } = req.body;

    try {
        const user = await userModel.getUserByEmail(email);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
            console.log('User logged in:', email);
            return res.status(200).json({ success: true });
        } else {
            console.log("", email);
            return res.status(401).json({ success: false, message: 'Invalid password' });
        }
    } catch (error) {
        console.error('Error al hacer login del usuario:', error);
        res.status(500).json({ success: false, message: 'Error al hacer login del usuario' });
    }
};

/**
 * Controlador para obtener todos los usuarios
 */
const getUsers = async (req, res) => {
    try {
        const users = await userModel.getUsers();
        // Formatear la fecha de nacimiento y construir la URL completa de la imagen de perfil
        const formattedUsers = users.map((user) => ({
            ...user,
            birth_date: moment(user.birth_date).format("DD-MM-YYYY"),
            profile_pic: user.profile_pic ? `${BASE_URL}${user.profile_pic}` : null,
        }));
        res.status(201).json(formattedUsers);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Error al obtener los usuarios",
        });
    }
};

/**
 * Controlador para obtener un usuario por su correo electrónico
 */
const getUserByEmail = async (req, res) => {
    const { email } = req.params;
    try {
        const user = await userModel.getUserByEmail(email);
        if (user) {
            user.gender = user.gender.charAt(0).toUpperCase() + user.gender.slice(1);
            user.birth_date = moment(user.birth_date).format("DD-MM-YYYY");
            user.profile_pic = user.profile_pic
                ? `${BASE_URL}${user.profile_pic}`
                : null;
            res.status(200).json(user);
        } else {
            res.status(404).json({
                success: false,
                error: "Usuario no encontrado",
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Error al obtener el usuario",
        });
    }
};

/**
 * Controlador para actualizar un usuario por su correo electrónico
 */
const updateUserByEmail = async (req, res) => {
    const { email } = req.params;
    const userData = req.body;
    try {
        const user = await userModel.getUserByEmail(email);
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        // Si se recibe un archivo, actualizar la imagen de perfil
        if (req.file) {
            userData.profile_pic = `${relative_zazil_users_path}${req.file.filename}`;
            // Eliminar la imagen anterior si no es la imagen por defecto
            if (user.profile_pic && user.profile_pic !== `${relative_zazil_users_path}default_profile_pic.jpg`) {
                const fullPath = path.join(
                    zazil_users_path,
                    path.basename(user.profile_pic)
                );
                fs.unlink(fullPath, (err) => {
                    if (err) {
                        console.error("Error al eliminar el archivo:", err);
                    }
                });
            }
        } else {
            userData.profile_pic = user.profile_pic;
        }

        // Actualizar solo los campos recibidos en el cuerpo de la solicitud
        const updatedUser = await userModel.updateUserByEmail(email, userData);
        updatedUser.birth_date = moment(updatedUser.birth_date).format("DD-MM-YYYY");
        updatedUser.profile_pic = updatedUser.profile_pic
            ? `${BASE_URL}${updatedUser.profile_pic}`
            : null;

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error al actualizar el usuario:", error);
        res.status(500).json({ error: "Error al actualizar el usuario" });
    }
};

/**
 * Controlador para eliminar un usuario por su correo electrónico
 */
const deleteUserByEmail = async (req, res) => {
    const { email } = req.params;
    try {
        const user = await userModel.getUserByEmail(email);
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        const deletedUser = await userModel.deleteUserByEmail(email);
        if (deletedUser) {
            // Eliminar la imagen de perfil del servidor si no es la imagen por defecto
            if (deletedUser.profile_pic && deletedUser.profile_pic !== `${process.env.relative_zazil_users_path}default_profile_pic.jpg`) {
                const fullPath = path.join(
                    process.env.zazil_users_path,
                    path.basename(deletedUser.profile_pic)
                );
                console.log(fullPath);
                fs.unlink(fullPath, (err) => {
                    if (err) {
                        console.error("Error al eliminar el archivo:", err);
                    }
                });
            }
            console.log("Usuario eliminado exitosamente:", email);
            res.status(200).json({ message: "Usuario eliminado correctamente" });
        } else {
            res.status(404).json({ error: "Usuario no encontrado" });
        }
    } catch (error) {
        console.error("Error al eliminar el usuario:", error);
        res.status(500).json({ error: "Error al eliminar el usuario" });
    }
};

module.exports = {
    createUser,
    loginUserByEmail,
    getUsers,
    getUserByEmail,
    updateUserByEmail,
    deleteUserByEmail,
};
