// models/userModel.js

const { Pool } = require('pg'); // Importa el pool de conexión de pg

// Configura la conexión a la base de datos
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

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
