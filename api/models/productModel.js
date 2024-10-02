// models/productModel.js

const { Pool } = require('pg'); // Importa el pool de conexión de pg

// Configura la conexión a la base de datos
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Función para crear un nuevo producto
const createProduct = async (productData) => {
    const { sku, name, price, description, dimensions, image_path, category, rating } = productData;
    const res = await pool.query(
        'INSERT INTO products (sku, name, price, description, dimensions, image_path, category, rating) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
        [sku, name, price, description, dimensions, image_path, category, rating]
    );
    return res.rows[0];
};

// Función para obtener todos los productos
const getAllProducts = async () => {
    const res = await pool.query('SELECT * FROM products');
    return res.rows;
};

// Función para obtener un producto por su SKU
const getProductBySku = async (sku) => {
    const res = await pool.query('SELECT * FROM products WHERE sku = $1', [sku]);
    return res.rows[0];
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductBySku,
};