const pool = require('./db');

// Función para crear un nuevo item de orden
const createOrderItem = async (orderItemData) => {
    const { order_number, product_sku, quantity, price } = orderItemData;
    const res = await pool.query(
        'INSERT INTO Orderitems (order_number, product_sku, quantity, price) VALUES ($1, $2, $3, $4) RETURNING *',
        [order_number, product_sku, quantity, price]
    );
    return res.rows[0];
};

// Función para obtener todos los items de una orden
const getOrderItemsByOrderNumber = async (order_number) => {
    const res = await pool.query(`
        SELECT oi.*, p.name AS product_name
        FROM Orderitems oi
        JOIN Products p ON oi.product_sku = p.sku
        WHERE oi.order_number = $1
    `, [order_number]);
    return res.rows;
};

// Función para actualizar un item de orden por su ID
const updateOrderItemById = async (order_item_id, orderItemData) => {
    const { order_number, product_sku, quantity, price } = orderItemData;
    const res = await pool.query(
        'UPDATE Orderitems SET order_number = $1, product_sku = $2, quantity = $3, price = $4 WHERE order_item_id = $5 RETURNING *',
        [order_number, product_sku, quantity, price, order_item_id]
    );
    return res.rows[0];
};

// Función para eliminar un item de orden por su ID
const deleteOrderItemById = async (order_item_id) => {
    const res = await pool.query('DELETE FROM Orderitems WHERE order_item_id = $1 RETURNING *', [order_item_id]);
    return res.rows[0];
};

module.exports = {
    createOrderItem,
    getOrderItemsByOrderNumber,
    updateOrderItemById,
    deleteOrderItemById,
};