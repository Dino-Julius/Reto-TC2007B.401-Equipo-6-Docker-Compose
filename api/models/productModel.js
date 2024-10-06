const pool = require('./db');

/**
 * Crea un nuevo producto.
 */
const createProduct = async (productData) => {
    const { sku, name, price, description, dimensions, image_path, category, rating, disponibility } = productData;
    const res = await pool.query(
        'INSERT INTO products (sku, name, price, description, dimensions, image_path, category, rating, disponibility) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
        [sku, name, price, description, dimensions, image_path, category, rating, disponibility]
    );
    return res.rows[0];
};

/**
 * Obtiene todos los productos.
 */
const getProducts = async () => {
    const res = await pool.query('SELECT * FROM products');
    return res.rows;
};

/**
 * Obtiene un producto por su SKU.
 */
const getProductBySku = async (sku) => {
    const res = await pool.query('SELECT * FROM products WHERE sku = $1', [sku]);
    return res.rows[0];
};

/**
 * Actualiza un producto por su SKU.
 */
const updateProductBySku = async (sku, productData) => {
    const { name, price, description, dimensions, image_path, category, rating, disponibility } = productData;
    const res = await pool.query(
        'UPDATE products SET name = $1, price = $2, description = $3, dimensions = $4, image_path = $5, category = $6, rating = $7, disponibility = $8 WHERE sku = $9 RETURNING *',
        [name, price, description, dimensions, image_path, category, rating, disponibility, sku]
    );
    return res.rows[0];
};

/**
 * Elimina un producto por su SKU.
 */
const deleteProductBySku = async (sku) => {
    const res = await pool.query('DELETE FROM products WHERE sku = $1 RETURNING *', [sku]);
    return res.rows[0];
};

module.exports = {
    createProduct,
    getProducts,
    getProductBySku,
    updateProductBySku,
    deleteProductBySku,
};