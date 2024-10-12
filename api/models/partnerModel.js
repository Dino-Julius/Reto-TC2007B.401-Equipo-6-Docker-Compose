const pool = require('./db');

// Función para crear un nuevo socio
const createPartner = async (partnerData) => {
    const { first_name, last_name, birth_date, email, password, account_status, account_type, profile_pic } = partnerData;
    const res = await pool.query(
        'INSERT INTO partners (first_name, last_name, birth_date, email, password, account_status, account_type, profile_pic) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
        [first_name, last_name, birth_date, email, password, account_status, account_type, profile_pic]
    );
    return res.rows[0];
};

// Función para obtener todos los socios
const getPartners = async () => {
    const res = await pool.query('SELECT first_name, last_name, birth_date, email, account_status, account_type, profile_pic FROM partners');
    return res.rows;
};

// Función para obtener un socio por su ID
const getPartnerById = async (partner_id) => {
    const res = await pool.query('SELECT * FROM partners WHERE partner_id = $1', [partner_id]);
    return res.rows[0];
};

// Función para obtener un socio por su correo electrónico
const getPartnerByEmail = async (email) => {
    const res = await pool.query('SELECT * FROM partners WHERE email = $1', [email]);
    return res.rows[0];
};

// Función para actualizar un socio por su correo electrónico
const updatePartnerByEmail = async (email, partnerData) => {
    const { first_name, last_name, birth_date, new_email, password, account_status, account_type, profile_pic } = partnerData;
    const res = await pool.query(
        'UPDATE partners SET first_name = $1, last_name = $2, birth_date = $3, email = $4, password = $5, account_status = $6, account_type = $7, profile_pic = $8 WHERE email = $9 RETURNING *',
        [first_name, last_name, birth_date, new_email, password, account_status, account_type, profile_pic, email]
    );
    return res.rows[0];
};

// Función para cambiar el estado de la cuenta por correo electrónico
const updatePartnerAccountStatusByEmail = async (email, account_status) => {
    const res = await pool.query(
        'UPDATE partners SET account_status = $1 WHERE email = $2 RETURNING *',
        [account_status, email]
    );
    return res.rows[0];
};

// Función para eliminar un socio por su correo electrónico
const deletePartnerByEmail = async (email) => {
    const res = await pool.query('DELETE FROM partners WHERE email = $1 RETURNING *', [email]);
    return res.rows[0];
};

module.exports = {
    createPartner,
    getPartners,
    getPartnerById,
    getPartnerByEmail,
    updatePartnerByEmail,
    updatePartnerAccountStatusByEmail,
    deletePartnerByEmail,
};