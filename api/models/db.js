const { Pool } = require('pg');

/**
 * Configuración de la conexión a la base de datos
 * user: Nombre de usuario de la base de datos
 * host: Host de la base de datos
 * database: Nombre de la base de datos
 * password: Contraseña de la base de datos
 * port: Puerto de la base de datos
 */
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

module.exports = pool;