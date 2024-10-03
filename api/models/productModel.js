const pool = require('./db');

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

// Función para actualizar un producto por su SKU
const updateProductBySku = async (sku, productData) => {
    const { name, price, description, dimensions, image_path, category, rating } = productData;
    const res = await pool.query(
        'UPDATE products SET name = $1, price = $2, description = $3, dimensions = $4, image_path = $5, category = $6, rating = $7 WHERE sku = $8 RETURNING *',
        [name, price, description, dimensions, image_path, category, rating, sku]
    );
    return res.rows[0];
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductBySku,
    updateProductBySku,
};