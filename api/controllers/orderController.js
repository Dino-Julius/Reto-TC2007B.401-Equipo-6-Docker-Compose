const orderModel = require('../models/orderModel');
const orderItemModel = require('../models/orderItemModel');
const productModel = require('../models/productModel');
const moment = require('moment');

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

const generateOrderNumber = () => {
    return `ORD-${Date.now()}`;
};

const createOrderWithItems = async (req, res) => {
    const { address, email, items } = req.body;

    const orderData = {
        order_number: generateOrderNumber(),
        user_email: email,
        shipping_address: address,
        shipping_status: 'pending',
        order_date: moment().format('YYYY-MM-DD HH:mm:ss'), // Formato de fecha/hora adecuado
        delivery_date: moment().add(7, 'days').format('YYYY-MM-DD HH:mm:ss'), // Ejemplo de fecha de entrega
        total_price: 0 // Se actualizará más adelante
    };

    try {
        const newOrder = await orderModel.createOrder(orderData);

        // Crear los items de la orden y calcular el total
        let totalPrice = 0;
        for (const item of items) {
            const product = await productModel.getProductBySku(item.sku); // Obtener el producto por SKU
            const itemPrice = product.price * item.quantity;
            totalPrice += itemPrice;

            const orderItemData = {
                order_number: newOrder.order_number,
                product_sku: item.sku,
                quantity: item.quantity,
                price: product.price // Asegúrate de que el precio esté incluido en los items
            };
            await orderItemModel.createOrderItem(orderItemData);
        }

        // Actualizar el precio total de la orden
        await orderModel.updateOrderTotalPrice(newOrder.order_id, totalPrice);

        res.status(201).json(newOrder);
    } catch (error) {
        console.error('Error processing order:', error);
        res.status(500).send({ message: "Error processing order" });
    }
};


// const createOrderWithItems = async (req, res) => {
//     const { orderData, orderItems } = req.body;

//     if (!orderData || !orderItems) {
//         console.log(orderData, orderItems);
//         return res.status(400).json({ error: 'Faltan datos de la orden o de los items de la orden' });
//     }

//     try {
//         // Crear la orden
//         const newOrder = await orderModel.createOrder(orderData);

//         // Crear los items de la orden
//         for (const item of orderItems) {
//             item.order_number = newOrder.order_number;
//             await createOrderItem(item);
//         }

//         // Obtener la orden completa con los items
//         const completeOrder = await orderModel.getOrderById(newOrder.order_id);

//         res.status(201).json(completeOrder);
//     } catch (error) {
//         console.error('Error creating order with items:', error);
//         res.status(500).send({ error: error.message });
//     }
// };

// Obtener todas las órdenes
const getOrders = async (req, res) => {
    try {
        const orders = await orderModel.getAllOrders();
        const formattedOrders = orders.map(order => ({
            ...order,
            shipping_status: order.shipping_status.charAt(0).toUpperCase() + order.shipping_status.slice(1),
            order_date: moment(order.order_date).format('DD-MM-YYYY'),
            delivery_date: moment(order.delivery_date).format('DD-MM-YYYY'),
        }));
        res.status(200).json(formattedOrders);
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

// Obtener órdenes por user_email
const getOrdersByUserEmail = async (req, res) => {
    const { user_email } = req.params;
    try {
        const orders = await orderModel.getOrdersByUserEmail(user_email);
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error al obtener las órdenes por user_email:', error);
        res.status(500).json({ error: 'Error al obtener las órdenes por user_email' });
    }
};

module.exports = {
    createOrder,
    createOrderWithItems,
    getOrders,
    getOrderById,
    updateOrderById,
    getOrdersByUserEmail,
};