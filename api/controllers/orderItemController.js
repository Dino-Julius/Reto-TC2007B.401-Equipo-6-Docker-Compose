const orderItemModel = require('../models/orderItemModel');

// Crear un nuevo item de orden
const createOrderItem = async (req, res) => {
    const orderItemData = req.body;
    try {
        const newOrderItem = await orderItemModel.createOrderItem(orderItemData);
        res.status(201).json(newOrderItem);
    } catch (error) {
        console.error('Error al crear el item de orden:', error);
        res.status(500).json({ error: 'Error al crear el item de orden' });
    }
};

// Obtener todos los items de una orden
const getOrderItemsByOrderId = async (req, res) => {
    const { order_id } = req.params;
    try {
        const orderItems = await orderItemModel.getOrderItemsByOrderId(order_id);
        res.status(200).json(orderItems);
    } catch (error) {
        console.error('Error al obtener los items de la orden:', error);
        res.status(500).json({ error: 'Error al obtener los items de la orden' });
    }
};

// Actualizar un item de orden por su ID
const updateOrderItemById = async (req, res) => {
    const { order_item_id } = req.params;
    const orderItemData = req.body;
    try {
        const updatedOrderItem = await orderItemModel.updateOrderItemById(order_item_id, orderItemData);
        if (updatedOrderItem) {
            res.status(200).json(updatedOrderItem);
        } else {
            res.status(404).json({ error: 'Item de orden no encontrado' });
        }
    } catch (error) {
        console.error('Error al actualizar el item de orden:', error);
        res.status(500).json({ error: 'Error al actualizar el item de orden' });
    }
};

// Eliminar un item de orden por su ID
const deleteOrderItemById = async (req, res) => {
    const { order_item_id } = req.params;
    try {
        const deletedOrderItem = await orderItemModel.deleteOrderItemById(order_item_id);
        if (deletedOrderItem) {
            res.status(200).json(deletedOrderItem);
        } else {
            res.status(404).json({ error: 'Item de orden no encontrado' });
        }
    } catch (error) {
        console.error('Error al eliminar el item de orden:', error);
        res.status(500).json({ error: 'Error al eliminar el item de orden' });
    }
};

module.exports = {
    createOrderItem,
    getOrderItemsByOrderId,
    updateOrderItemById,
    deleteOrderItemById,
};