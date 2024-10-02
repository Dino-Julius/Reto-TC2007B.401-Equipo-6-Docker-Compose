// controllers/addressController.js

const addressModel = require('../models/addressModel');

// Crear una nueva dirección
const createAddress = async (req, res) => {
    const addressData = req.body;
    try {
        const newAddress = await addressModel.createAddress(addressData);
        res.status(201).json(newAddress);
    } catch (error) {
        console.error('Error al crear la dirección:', error);
        res.status(500).json({ error: 'Error al crear la dirección' });
    }
};

// Obtener una dirección por su ID
const getAddressById = async (req, res) => {
    const { address_id } = req.params;
    try {
        const address = await addressModel.getAddressById(address_id);
        if (address) {
            res.status(200).json(address);
        } else {
            res.status(404).json({ error: 'Dirección no encontrada' });
        }
    } catch (error) {
        console.error('Error al obtener la dirección:', error);
        res.status(500).json({ error: 'Error al obtener la dirección' });
    }
};

// Modificar una dirección por user_id y address_id
const updateAddressById = async (req, res) => {
    const { user_id, address_id } = req.params;
    const addressData = req.body;
    try {
        const updatedAddress = await addressModel.updateAddressById(user_id, address_id, addressData);
        if (updatedAddress) {
            res.status(200).json(updatedAddress);
        } else {
            res.status(404).json({ error: 'Dirección no encontrada' });
        }
    } catch (error) {
        console.error('Error al modificar la dirección:', error);
        res.status(500).json({ error: 'Error al modificar la dirección' });
    }
};

module.exports = {
    createAddress,
    getAddressById,
    updateAddressById,
};