const orderModel = require('../models/orderModel');

// Crear una nueva orden
const createOrder = async (req, res) => {
    const orderData = req.body;
    try {
        const newOrder = await orderModel.createOrder(orderData);
        res.status(201).json(newOrder);
    } catch (error) {
        console.error('Error al crear la orden:', error);
        res.status(500).json({ error: 'Error al crear la orden' });
    }
};

// Obtener todas las órdenes
const getAllOrders = async (req, res) => {
    try {
        const orders = await orderModel.getAllOrders();
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error al obtener las órdenes:', error);
        res.status(500).json({ error: 'Error al obtener las órdenes' });
    }
};

// Obtener una orden por su ID
const getOrderById = async (req, res) => {
    const { order_id } = req.params;
    try {
        const order = await orderModel.getOrderById(order_id);
        if (order) {
            res.status(200).json(order);
        } else {
            res.status(404).json({ error: 'Orden no encontrada' });
        }
    } catch (error) {
        console.error('Error al obtener la orden:', error);
        res.status(500).json({ error: 'Error al obtener la orden' });
    }
};

// Actualizar una orden por su ID
const updateOrderById = async (req, res) => {
    const { order_id } = req.params;
    const orderData = req.body;
    try {
        const updatedOrder = await orderModel.updateOrderById(order_id, orderData);
        if (updatedOrder) {
            res.status(200).json(updatedOrder);
        } else {
            res.status(404).json({ error: 'Orden no encontrada' });
        }
    } catch (error) {
        console.error('Error al actualizar la orden:', error);
        res.status(500).json({ error: 'Error al actualizar la orden' });
    }
};

module.exports = {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderById,
};