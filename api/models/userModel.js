const pool = require('./db');

/**
 * Función para obtener todos los usuarios
 * @returns {Promise<Array>} Lista de usuarios
 */
const getUsers = async () => {
    const res = await pool.query('SELECT * FROM Users');
    return res.rows;
};

/**
 * Función para agregar un nuevo usuario
 * @param {Object} userData - Datos del usuario
 * @param {string} userData.first_name - Nombre
 * @param {string} userData.last_name - Apellido
 * @param {string} userData.birth_date - Fecha de nacimiento
 * @param {string} userData.gender - Género
 * @param {string} userData.phone - Teléfono
 * @param {string} userData.email - Correo electrónico
 * @param {string} userData.password - Contraseña
 * @param {string} userData.profile_pic - Foto de perfil
 * @returns {Promise<Object>} Usuario creado
 */
const createUser = async (userData) => {
    const { first_name, last_name, birth_date, gender, phone, email, password, profile_pic } = userData;
    const res = await pool.query(
        'INSERT INTO Users (first_name, last_name, birth_date, gender, phone, email, password, profile_pic) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
        [first_name, last_name, birth_date, gender, phone, email, password, profile_pic]
    );
    return res.rows[0];
};

/**
 * Función para obtener un usuario por su correo electrónico
 * @param {string} email - Correo electrónico del usuario
 * @returns {Promise<Object>} Usuario encontrado
 */
const getUserByEmail = async (email) => {
    const res = await pool.query('SELECT * FROM Users WHERE email = $1', [email]);
    return res.rows[0];
};

/**
 * Función para actualizar un usuario por su correo electrónico
 * @param {string} email - Correo electrónico del usuario a actualizar
 * @param {Object} userData - Datos del usuario
 * @param {string} userData.first_name - Nombre
 * @param {string} userData.last_name - Apellido
 * @param {string} userData.birth_date - Fecha de nacimiento
 * @param {string} userData.gender - Género
 * @param {string} userData.phone - Teléfono
 * @param {string} userData.new_email - Nuevo correo electrónico
 * @param {string} userData.password - Contraseña
 * @returns {Promise<Object>} Usuario actualizado
 */
const updateUserByEmail = async (email, userData) => {
    const { first_name, last_name, birth_date, gender, phone, new_email, password } = userData;
    const res = await pool.query(
        'UPDATE Users SET first_name = $1, last_name = $2, birth_date = $3, gender = $4, phone = $5, email = $6, password = $7 WHERE email = $8 RETURNING *',
        [first_name, last_name, birth_date, gender, phone, new_email, password, email]
    );
    return res.rows[0];
};

/**
 * Función para actualizar solo la imagen de perfil de un usuario por su correo electrónico
 * @param {string} email - Correo electrónico del usuario
 * @param {string} profile_pic - Nueva foto de perfil
 * @returns {Promise<Object>} Usuario actualizado
 */
const updateUserProfilePicByEmail = async (email, profile_pic) => {
    const res = await pool.query(
        'UPDATE Users SET profile_pic = $1 WHERE email = $2 RETURNING *',
        [profile_pic, email]
    );
    return res.rows[0];
};

/**
 * Función para eliminar un usuario por su correo electrónico
 * @param {string} email - Correo electrónico del usuario a eliminar
 * @returns {Promise<Object>} Usuario eliminado
 */
const deleteUserByEmail = async (email) => {
    const res = await pool.query('DELETE FROM Users WHERE email = $1 RETURNING *', [email]);
    return res.rows[0];
};

module.exports = {
    getUsers,
    createUser,
    getUserByEmail,
    updateUserByEmail,
    updateUserProfilePicByEmail,
    deleteUserByEmail,
};