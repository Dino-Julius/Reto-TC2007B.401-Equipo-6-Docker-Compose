const pool = require('./db');

// Función para crear una nueva dirección
const createAddress = async (addressData) => {
    const { user_id, address, city, state, country } = addressData;
    const res = await pool.query(
        'INSERT INTO addresses (user_id, address, city, state, country) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [user_id, address, city, state, country]
    );
    return res.rows[0];
};

// Función para obtener una dirección por su ID
const getAddressById = async (address_id) => {
    const res = await pool.query('SELECT * FROM addresses WHERE address_id = $1', [address_id]);
    return res.rows[0];
};

// Función para modificar una dirección por user_id y address_id
const updateAddressById = async (user_id, address_id, addressData) => {
    const { address, city, state, country } = addressData;
    const res = await pool.query(
        'UPDATE addresses SET address = $1, city = $2, state = $3, country = $4 WHERE user_id = $5 AND address_id = $6 RETURNING *',
        [address, city, state, country, user_id, address_id]
    );
    return res.rows[0];
};

module.exports = {
    createAddress,
    getAddressById,
    updateAddressById,
};