const pool = require('./db');

// Función para crear un nuevo socio
const createPartner = async (partnerData) => {
    const { first_name, last_name, birth_date, email, password, account_status, account_type } = partnerData;
    const res = await pool.query(
        'INSERT INTO partners (first_name, last_name, birth_date, email, password, account_status, account_type) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [first_name, last_name, birth_date, email, password, account_status, account_type]
    );
    return res.rows[0];
};

// Función para obtener todos los socios
const getAllPartners = async () => {
    const res = await pool.query('SELECT * FROM partners');
    return res.rows;
};

// Función para obtener un socio por su ID
const getPartnerById = async (partner_id) => {
    const res = await pool.query('SELECT * FROM partners WHERE partner_id = $1', [partner_id]);
    return res.rows[0];
};

module.exports = {
    createPartner,
    getAllPartners,
    getPartnerById,
};