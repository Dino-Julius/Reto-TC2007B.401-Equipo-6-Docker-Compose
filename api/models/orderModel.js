const pool = require('./db');

// Función para crear una nueva orden
const createOrder = async (orderData) => {
    const { order_number, user_id, shipping_address_id, shipping_status, order_date, delivery_date, total_price } = orderData;
    const res = await pool.query(
        'INSERT INTO orders (order_number, user_id, shipping_address_id, shipping_status, order_date, delivery_date, total_price) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [order_number, user_id, shipping_address_id, shipping_status, order_date, delivery_date, total_price]
    );
    return res.rows[0];
};

// Función para obtener todas las órdenes
const getAllOrders = async () => {
    const res = await pool.query('SELECT * FROM orders');
    return res.rows;
};

// Función para obtener una orden por su ID
const getOrderById = async (order_id) => {
    const res = await pool.query('SELECT * FROM orders WHERE order_id = $1', [order_id]);
    return res.rows[0];
};

// Función para actualizar una orden por su ID
const updateOrderById = async (order_id, orderData) => {
    const { order_number, user_id, shipping_address_id, shipping_status, order_date, delivery_date, total_price } = orderData;
    const res = await pool.query(
        'UPDATE orders SET order_number = $1, user_id = $2, shipping_address_id = $3, shipping_status = $4, order_date = $5, delivery_date = $6, total_price = $7 WHERE order_id = $8 RETURNING *',
        [order_number, user_id, shipping_address_id, shipping_status, order_date, delivery_date, total_price, order_id]
    );
    return res.rows[0];
};

module.exports = {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderById,
};