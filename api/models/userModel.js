const pool = require("./db");

/**
 * Modelo para crear un nuevo usuario
 */
const createUser = async (userData) => {
    const { first_name, last_name, birth_date, gender, phone, email, password, profile_pic, shipping_address } = userData;
    const res = await pool.query("INSERT INTO Users (first_name, last_name, birth_date, gender, phone, email, password, profile_pic, shipping_address) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *", [first_name, last_name, birth_date, gender, phone, email, password, profile_pic, shipping_address]);
    return res.rows[0];
};

/**
 * Modelo para obtener todos los usuarios
 */
const getUsers = async () => {
    const res = await pool.query("SELECT first_name, last_name, birth_date, gender, phone, email, profile_pic, shipping_address FROM Users");
    return res.rows;
};


/**
 * Modelo para obtener un usuario por su correo electrónico (verificación)
 */
const getUserByEmail = async (email) => {
    const res = await pool.query("SELECT * FROM Users WHERE email = $1", [email]);
    return res.rows[0];
};

/**
 * Modelo para actualizar un usuario por su correo electrónico
 */
const updateUserByEmail = async (email, userData) => {
    const fields = [];
    const values = [];
    let query = "UPDATE Users SET ";

    Object.keys(userData).forEach((key, index) => {
        fields.push(`${key} = $${index + 1}`);
        values.push(userData[key]);
    });

    query += fields.join(", ");
    query += " WHERE email = $" + (values.length + 1) + " RETURNING *";
    values.push(email);

    const res = await pool.query(query, values);
    return res.rows[0];
};

/**
 * Modelo para eliminar un usuario por su correo electrónico
 */
const deleteUserByEmail = async (email) => {
    const res = await pool.query(
        "DELETE FROM Users WHERE email = $1 RETURNING *",
        [email]
    );
    return res.rows[0];
};

module.exports = {
    createUser,
    getUsers,
    getUserByEmail,
    updateUserByEmail,
    deleteUserByEmail,
};