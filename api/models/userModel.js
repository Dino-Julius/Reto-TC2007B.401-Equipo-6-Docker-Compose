const pool = require('./db');

// Función para obtener todos los usuarios
const getUsers = async () => {
    const res = await pool.query('SELECT * FROM Users');
    return res.rows;
};

// Función para agregar un nuevo usuario
const createUser = async (userData) => {
    const { first_name, last_name, birth_date, gender, phone, email, password } = userData;
    const res = await pool.query(
        'INSERT INTO Users (first_name, last_name, birth_date, gender, phone, email, password) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [first_name, last_name, birth_date, gender, phone, email, password]
    );
    return res.rows[0];
};

module.exports = {
    getUsers,
    createUser,
};
