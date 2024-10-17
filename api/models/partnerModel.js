const pool = require('./db');

/**
 * Modelo para obtener un socio por su ID
 */
const createPartner = async (partnerData) => {
    const { first_name, last_name, birth_date, email, password, account_status, account_type, profile_pic } = partnerData;
    const res = await pool.query(
        'INSERT INTO partners (first_name, last_name, birth_date, email, password, account_status, account_type, profile_pic) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
        [first_name, last_name, birth_date, email, password, account_status, account_type, profile_pic]
    );
    return res.rows[0];
};

/**
 * Modelo para obtener todoss los socios
 */
const getPartners = async () => {
    const res = await pool.query('SELECT first_name, last_name, birth_date, email, account_status, account_type, profile_pic FROM partners');
    return res.rows;
};

/**
 * Modelo para obtener un socio por su Email
 */
const getPartnerByEmail = async (email) => {
    const res = await pool.query('SELECT * FROM partners WHERE email = $1', [email]);
    return res.rows[0];
};

/**
 * Modelo para actualizar un socio por su correo electrónico
 */
const updatePartnerByEmail = async (email, partnerData) => {
    const fields = [];
    const values = [];
    let query = "UPDATE Partners SET ";

    // Convertir account_status a booleano
    if (partnerData.account_status) {
        partnerData.account_status = partnerData.account_status === 'enabled';
    }

    Object.keys(partnerData).forEach((key, index) => {
        fields.push(`${key} = $${index + 1}`);
        values.push(partnerData[key]);
    });

    query += fields.join(", ");
    query += " WHERE email = $" + (values.length + 1) + " RETURNING *";
    values.push(email);

    const res = await pool.query(query, values);
    return res.rows[0];
};

const updatePartnerAccountStatusByEmail = async (email, account_status) => {
    const res = await pool.query(
        'UPDATE Partners SET account_status = $1 WHERE email = $2 RETURNING *',
        [account_status, email]
    );
    return res.rows[0];
};

/**
 * Frem tos de cuenta de socio por su correo electrónico.
 */
const deletePartnerByEmail = async (email) => {
    const res = await pool.query('DELETE FROM partners WHERE email = $1 RETURNING *', [email]);
    return res.rows[0];
};

module.exports = {
    createPartner,
    getPartners,
    getPartnerByEmail,
    updatePartnerByEmail,
    updatePartnerAccountStatusByEmail,
    deletePartnerByEmail,
};